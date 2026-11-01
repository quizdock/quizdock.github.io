---
title: Sign-in with OpenID Connect
description: Connect QuizDock to an OpenID Connect provider — client registration, variables, roles, Bearer tokens, open access, Docker networking, and the bundled Keycloak or Authentik.
sidebar:
  order: 4
---

In OIDC mode (`AUTH_MODE=oidc`), hosts and participants sign in with your identity provider, and as many hosts as you like each have their own quiz bank. This page connects a provider. The variables themselves are in [Configuration](/docs/operator/configuration/#access--authentication).

## Which providers work

QuizDock relies only on the OpenID Connect standards: Discovery 1.0, the Authorization Code flow with PKCE, refresh tokens, JWKS-signed tokens, RP-initiated logout and the Core 1.0 claims; for `Bearer` tokens, the JWT access token profile (RFC 9068) and token introspection (RFC 7662). It has no code specific to one provider.

The providers tested and shipped with QuizDock are **Keycloak** and **Authentik** (the [full setup](/docs/operator/choose-a-deployment/)). Others that implement these standards should work; they have not been tested.

## How sign-in works

The backend is the OIDC client and keeps the tokens. The browser never holds a token: it holds a random session id in an `httpOnly` cookie that no script can read.

1. **Sign in** sends the browser to your provider with an Authorization Code + PKCE request. The provider is found through `<OIDC_ISSUER>/.well-known/openid-configuration`.
2. The provider sends the browser back to `<your instance>/auth/callback`. The backend exchanges the code at the token endpoint and checks the ID token: signature against the provider's keys, issuer, audience (`OIDC_CLIENT_ID`), expiry and the sign-in's nonce. The account, its name and its roles are the ID token's. The backend then opens a session in Redis.
3. Every request and the game socket carry the session cookie (`qd_session`: `httpOnly`, `SameSite=Lax`, `Secure` over HTTPS). Before the access token expires, the backend renews the tokens with the refresh token; a renewed ID token is checked the same way and must name the same account, or the session ends. Roles changed at the provider apply at the next renewal.
4. A request that changes something is accepted with the cookie only from the application's own pages. A page from another origin, even on the same site, gets `403 auth.cross_origin`.
5. **Log out** ends the session in QuizDock, then at the provider when it publishes an end-session endpoint.

The tabs of one browser share the session: a console, a projection or a preview opened in a new tab stays signed in. A session unused for 24 hours is forgotten; the provider bounds it too, through its refresh tokens. Sessions live in Redis: in the standalone image, where Redis keeps nothing on disk, restarting the container signs everyone out.

A client that is not a browser may send `Authorization: Bearer <access token>` instead of the cookie: see [Bearer tokens](#bearer-tokens).

The provider's sign-in page is the provider's own: QuizDock's [branding](/docs/admin/branding/) does not dress it. Give it your organisation's look in the provider; for Keycloak, with a theme of its own for the realm's login pages.

## Register the client

On your provider, create a client for QuizDock:

- **Type:** public with PKCE (S256), or confidential with a secret (then set `OIDC_CLIENT_SECRET`). Standard (authorization code) flow.
- **Refresh tokens:** issued. Without them, the session ends with the first access token.
- **Valid redirect URI:** `https://quiz.example.org/auth/callback`
- **Valid post-logout redirect URI:** `https://quiz.example.org`
- **Roles:** a `host` role (or group) for the people who create and present quizzes, an `admin` role for those who administer the instance, both **in the ID token** under one claim. See [Roles](#roles).

The backend asks for the scopes in `OIDC_SCOPE`, `openid profile email` by default. Add the scope that brings the roles if your provider needs one (Authentik: `entitlements`), and `offline_access` if it gives a refresh token only then (Authentik).

## Set the variables

In `.env`, on the server, in the instance's folder:

```dotenv
AUTH_MODE=oidc
OIDC_ISSUER=https://sso.example.org/realms/quizdock   # exactly the `iss` of the tokens
OIDC_CLIENT_ID=quizdock
OIDC_CLIENT_SECRET=                                   # confidential client only
OIDC_SCOPE=openid profile email                       # scopes asked at sign-in
OIDC_ROLES_CLAIM=roles                                # dotted path to the roles array, in the ID token
OIDC_INTERNAL_URL=                                    # when the backend reaches the provider elsewhere
OIDC_AUDIENCE=                                        # optional: expected `aud`
OIDC_NAME_CLAIM=                                      # optional: display-name claim
APP_PUBLIC_URL=https://quiz.example.org
```

Then apply it (`./quizdock up`) and check it:

```sh
./quizdock doctor
```

In OIDC mode, `doctor` fetches the discovery document and the keys, and says which issuer, client and roles claim it uses. It also warns when the instance relied on a way of reading tokens that ends in 1.0 (see [Deprecated until 1.0](#deprecated-until-10)). See [Status and doctor](/docs/operator/status-and-doctor/).

`OIDC_ISSUER` is compared with the tokens' `iss` exactly, trailing slash included. Copy the `issuer` field of your provider's discovery document.

## Roles

QuizDock reads an array of role names from the ID token, in the claim `OIDC_ROLES_CLAIM` points at: a flat `roles` (the default), `groups`, or a dotted path such as `resource_access.quizdock.roles`. A wrong path locks every administrator out. The roles are QuizDock's own: give them as roles of its client, not of the whole realm or tenant.

- **Keycloak:** client roles `host` and `admin` on QuizDock's client, and a *User Client Role* mapper on that client, claim name `roles`, *Add to ID token* on. The [bundled realm](#the-bundled-keycloak) is set up this way.
- **Authentik:** application entitlements `host` and `admin` on QuizDock's application, granted to groups, and the scope `entitlements` in `OIDC_SCOPE`: Authentik's own *Application Entitlements* mapping puts them in `roles`. The [bundled blueprint](#the-bundled-authentik) is set up this way.

| Role in the token | What the account does |
|---|---|
| `host` | Creates, edits and presents its own quizzes |
| `admin` | Reads the whole instance and administers it; does not host on its own |
| `host` and `admin` | Both: the usual account on a small instance |
| neither | Takes part in games |

An operator can also grant roles that no token carries, and that a token never removes:

```sh
./quizdock user:list
./quizdock user:set-role alice@example.org host,admin
```

The account must have signed in once to exist. `user:set-role … player` withdraws the grant. See [Accounts and roles](/docs/admin/accounts-and-roles/).

## Bearer tokens

A client that is not a browser sends `Authorization: Bearer <access token>`. QuizDock is then the resource server: it checks the token's signature against the provider's keys, its issuer, its expiry and, when `OIDC_AUDIENCE` is set, its audience. The account, its name and its roles are the access token's.

An ID token must not open the API: QuizDock's own travels in the browser when it signs out (`id_token_hint`). The provider says which token is an access token, in one of two standard ways:

- **The token is marked** `typ: at+jwt` in its header (RFC 9068). Keycloak does so for a client with *Use "at+jwt" as access token header type* on, in its advanced settings.
- **The provider is asked** (RFC 7662 introspection): with a confidential client (`OIDC_CLIENT_SECRET`) and an `introspection_endpoint` in the discovery document, QuizDock asks whether the token is an active access token, and keeps the answer a minute. Authentik answers this way. Keycloak answers only for tokens whose audience includes QuizDock's client.

Neither: see [Deprecated until 1.0](#deprecated-until-10).

## The display name

The lobby, the leaderboard and the podium show `preferred_username`, then `name`, then `email`, whichever the token has first. Point `OIDC_NAME_CLAIM` at another claim (the standard `nickname`, or a dotted path) to change that; accounts whose token lacks it keep the standard chain.

## Who may take part

In OIDC mode everyone signs in, participants included. Two barriers stay independent: the account opens the application, the PIN opens one game. A PIN opens nothing without an account. Each participant's results are attached to their account.

### Open access

For lobbies without accounts to give (trainees who change every session, visitors at an event), set `ALLOW_ANONYMOUS_PARTICIPANTS=true`. Hosts still sign in, and each launch then asks how participants get in:

- **Accounts required**, as above;
- **Open access**: the PIN and a nickname are enough, as in local mode. Everyone is a guest, so there is no personal tracking.

Without the variable, every game requires accounts.

## One provider, two addresses (Docker)

The browser and the backend may reach the provider at different addresses: the browser at its public address, the backend over the Docker network (`http://keycloak:8080`).

- `OIDC_ISSUER` is the public address, the one the tokens carry.
- `OIDC_INTERNAL_URL` is the address the backend connects to. Discovery, the token endpoint, introspection and the keys then go through it, and the pages the browser is sent to keep the public address.
- On the internal address, the backend's requests still name the provider by the issuer's host and port (the HTTP `Host` header). A provider that derives its issuer from the request, as Authentik does, then signs tokens with the public one.
- The provider must name itself the same whoever asks: tokens obtained over the internal network must still carry the public issuer. With Keycloak, set `KC_HOSTNAME` to the public URL and `KC_HOSTNAME_BACKCHANNEL_DYNAMIC=true`; the full setup does it.

An `OIDC_JWKS_URI` on another host than the issuer is read the same way: its host becomes the internal address.

## The bundled Keycloak

The full setup with Keycloak (`./quizdock init --full --iam=keycloak`) runs Keycloak 26 with the realm shipped in `keycloak/realm-export.json`:

- realm `quiz-dock`, public client `quiz-dock-frontend`; the roles `host`, `admin` and `player` are roles of that client, and its mapper puts them in the `roles` claim of the ID token, the access token and UserInfo;
- two sample accounts, `host` (roles `host` and `admin`) and `player` (role `player`), with the temporary passwords `./quizdock init --full` wrote in `.env`;
- open access allowed (`ALLOW_ANONYMOUS_PARTICIPANTS=true` in the generated `.env`).

Keycloak imports the realm only into an empty database. A realm imported by an earlier release holds the roles as realm roles, read from the access token at `realm_access.roles`: it still works, with a warning (see [Deprecated until 1.0](#deprecated-until-10)), until you move them.

First sign-in, accounts and HTTPS: see [Install](/docs/operator/install/#the-full-setup-first-sign-in) and [Reverse proxy](/docs/operator/reverse-proxy/#the-full-setup-behind-https).

## The bundled Authentik

The full setup with Authentik (`./quizdock init --full --iam=authentik`) runs Authentik 2026.8, server and worker, with its own role and database in the same PostgreSQL. On its first start it loads the blueprint shipped in `authentik/quizdock.yaml`:

- the application `quiz-dock` (issuer `<Authentik>/application/o/quiz-dock/`, trailing slash included) and its provider: confidential client `quiz-dock`, its secret shared with QuizDock through `OIDC_CLIENT_SECRET`, authorization code and refresh token grants;
- the roles `admin`, `host` and `player` as application entitlements, each granted to a group: *QuizDock admins*, *QuizDock hosts*, *QuizDock players*. Put an account in a group to give it the role;
- two sample accounts, `host` (groups admins and hosts) and `player`, with the passwords `init` wrote in `.env`; and Authentik's own administrator, `akadmin`, with `AUTHENTIK_ADMIN_PASSWORD`;
- open access allowed, as with Keycloak.

QuizDock asks for `openid profile email entitlements offline_access`: `entitlements` brings the roles into the ID token, `offline_access` the refresh token. Every entry of the blueprint is created once and never overwritten: what you change in Authentik's interface stays.

Authentik marks e-mail addresses as unverified unless told otherwise, and QuizDock keeps no unverified address: give `./quizdock user:set-role` such an account's subject, shown by `./quizdock user:list`, not its e-mail.

### An Authentik you already run

The blueprint doubles as the reference configuration. Either import it (*Customization → Blueprints*), after setting `QUIZDOCK_APP_URL`, `QUIZDOCK_OIDC_CLIENT_SECRET`, `QUIZDOCK_HOST_PASSWORD` and `QUIZDOCK_PLAYER_PASSWORD` in the worker's environment and removing the sample accounts you do not want; or create the same by hand. Then, in QuizDock's `.env`:

```dotenv
AUTH_MODE=oidc
OIDC_ISSUER=https://id.example.org/application/o/quiz-dock/
OIDC_CLIENT_ID=quiz-dock
OIDC_CLIENT_SECRET=<the provider's client secret>
OIDC_SCOPE=openid profile email entitlements offline_access
OIDC_ROLES_CLAIM=roles
APP_PUBLIC_URL=https://quiz.example.org
```

With roles from your own scope mapping instead of entitlements, put that mapping's scope name in `OIDC_SCOPE`, in place of `entitlements`.

## Deprecated until 1.0

Two ways of reading tokens are kept for the installations that rely on them. Each use is written in the log, and `doctor` reports it for 30 days:

- **Roles read from the access token**, when the ID token lacks `OIDC_ROLES_CLAIM`: a Keycloak realm with realm roles (`realm_access.roles`) reads them there. Move the roles to QuizDock's client with a mapper that adds them to the ID token, as in [Roles](#roles), then set `OIDC_ROLES_CLAIM=roles`. Or, keeping realm roles, turn on *Add to ID token* on the realm's *realm roles* mapper.
- **A Bearer token judged on its claims**, when the provider neither marks it nor can be asked: QuizDock refuses it when it carries an ID token's claims (`nonce`, `at_hash`, `c_hash`, Keycloak's `typ: ID`) and accepts it otherwise. Have the provider mark access tokens (RFC 9068), or give QuizDock a confidential client.

Both end in 1.0.

## From local mode to OIDC mode

The same image and the same data: set `AUTH_MODE=oidc` and the provider's variables in `.env`, then restart. `AUTH_MODE` is a C1 variable: it is never changed from the administration.

Local-mode accounts are named `local:<slug>`, the name in lower case without accents; an OIDC account is a different account, even with the same name. To hand a quiz from one to the other, use `./quizdock quiz:transfer <quiz-id> <sub|email>` once the new account has signed in. See [Command line](/docs/operator/cli/).

## When it fails

The log lines and their fixes are in [Troubleshooting](/docs/operator/troubleshooting/#sign-in-with-openid-connect).

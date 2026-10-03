---
title: Sign-in with OpenID Connect
description: Connect QuizDock to an OpenID Connect provider — client registration, variables, roles, open access, Docker networking and the bundled Keycloak.
sidebar:
  order: 4
---

In OIDC mode (`AUTH_MODE=oidc`), hosts and participants sign in with your identity provider, and as many hosts as you like each have their own quiz bank. This page connects a provider. The variables themselves are in [Configuration](/docs/operator/configuration/#access--authentication).

## Which providers work

QuizDock relies only on the OpenID Connect standards: Discovery 1.0, the Authorization Code flow with PKCE, refresh tokens, JWKS-signed tokens, RP-initiated logout and the Core 1.0 claims. It has no code specific to one provider.

The provider tested and shipped with QuizDock is **Keycloak** (the [full setup](/docs/operator/choose-a-deployment/)). Others that implement these standards should work; they have not been tested.

## How sign-in works

The backend is the OIDC client and keeps the tokens. The browser never holds a token: it holds a random session id in an `httpOnly` cookie that no script can read.

1. **Sign in** sends the browser to your provider with an Authorization Code + PKCE request. The provider is found through `<OIDC_ISSUER>/.well-known/openid-configuration`.
2. The provider sends the browser back to `<your instance>/auth/callback`. The backend exchanges the code at the token endpoint, checks the ID token and opens a session in Redis.
3. Every request and the game socket carry the session cookie (`qd_session`: `httpOnly`, `SameSite=Lax`, `Secure` over HTTPS). The backend checks the access token's signature against the provider's keys, its issuer, its expiry and, when `OIDC_AUDIENCE` is set, its audience. It renews the token with the refresh token before it expires.
4. A request that changes something is accepted with the cookie only from the application's own pages. A page from another origin, even on the same site, gets `403 auth.cross_origin`.
5. **Log out** ends the session in QuizDock, then at the provider when it publishes an end-session endpoint.

The tabs of one browser share the session: a console, a projection or a preview opened in a new tab stays signed in. A session unused for 24 hours is forgotten; the provider bounds it too, through its refresh tokens. Sessions live in Redis: in the standalone image, where Redis keeps nothing on disk, restarting the container signs everyone out.

A client that is not a browser may send `Authorization: Bearer <access token>` instead of the cookie.

## Register the client

On your provider, create a client for QuizDock:

- **Type:** public with PKCE (S256), or confidential with a secret (then set `OIDC_CLIENT_SECRET`). Standard (authorization code) flow.
- **Refresh tokens:** issued. Without them, the session ends with the first access token.
- **Valid redirect URI:** `https://quiz.example.org/auth/callback`
- **Valid post-logout redirect URI:** `https://quiz.example.org`
- **Roles:** a `host` role (or group) for the people who create and present quizzes, an `admin` role for those who administer the instance, both in the token under one claim.

The backend asks for the scopes `openid profile email`.

## Set the variables

In `.env`, on the server, in the instance's folder:

```dotenv
AUTH_MODE=oidc
OIDC_ISSUER=https://sso.example.org/realms/quizdock   # exactly the `iss` of the tokens
OIDC_CLIENT_ID=quizdock
OIDC_CLIENT_SECRET=                                   # confidential client only
OIDC_ROLES_CLAIM=roles                                # dotted path to the roles array
OIDC_INTERNAL_URL=                                    # when the backend reaches the provider elsewhere
OIDC_AUDIENCE=                                        # optional: expected `aud`
OIDC_NAME_CLAIM=                                      # optional: display-name claim
APP_PUBLIC_URL=https://quiz.example.org
```

Then apply it (`./quizdock up`) and check it:

```sh
./quizdock doctor
```

In OIDC mode, `doctor` fetches the discovery document and the keys, and says which issuer, client and roles claim it uses. See [Status and doctor](/docs/operator/status-and-doctor/).

`OIDC_ISSUER` is compared with the tokens' `iss` exactly, trailing slash included. Copy the `issuer` field of your provider's discovery document.

## Roles

QuizDock reads an array of role names from the claim `OIDC_ROLES_CLAIM` points at: a flat `roles` (the default), `groups`, or a nested path such as `realm_access.roles` (Keycloak) or `resource_access.quizdock.roles`. A wrong path locks every administrator out.

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

## The display name

The lobby, the leaderboard and the podium show `preferred_username`, then `name`, then `email`, whichever the token has first. Point `OIDC_NAME_CLAIM` at another claim (the standard `nickname`, or a dotted path) to change that; accounts whose token lacks it keep the standard chain.

## Who may take part

In OIDC mode everyone signs in, participants included. Two barriers stay independent: the account opens the application, the PIN opens one game. A PIN opens nothing without an account. Each participant's results are attached to their account.

### Open access

For rooms without accounts to give (trainees who change every session, visitors at an event), set `ALLOW_ANONYMOUS_PARTICIPANTS=true`. Hosts still sign in, and each launch then asks how participants get in:

- **Accounts required**, as above;
- **Open access**: the PIN and a nickname are enough, as in local mode. Everyone is a guest, so there is no personal tracking.

Without the variable, every game requires accounts.

## One provider, two addresses (Docker)

The browser and the backend may reach the provider at different addresses: the browser at its public address, the backend over the Docker network (`http://keycloak:8080`).

- `OIDC_ISSUER` is the public address, the one the tokens carry.
- `OIDC_INTERNAL_URL` is the address the backend uses. Discovery, the token endpoint and the keys then go through it, and the pages the browser is sent to keep the public address.
- The provider must name itself the same whoever asks: tokens obtained over the internal network must still carry the public issuer. With Keycloak, set `KC_HOSTNAME` to the public URL and `KC_HOSTNAME_BACKCHANNEL_DYNAMIC=true`; the full setup does it.

An `OIDC_JWKS_URI` on another host than the issuer is read the same way: its host becomes the internal address.

## The bundled Keycloak

The full setup runs Keycloak 26 with the realm shipped in `keycloak/realm-export.json`:

- realm `quiz-dock`, public client `quiz-dock-frontend`, roles under `realm_access.roles`;
- two sample accounts, `host` (roles `host` and `admin`) and `player` (role `player`), with the temporary passwords `./quizdock init --full` wrote in `.env`;
- open access allowed (`ALLOW_ANONYMOUS_PARTICIPANTS=true` in the generated `.env`).

First sign-in, accounts and HTTPS: see [Install](/docs/operator/install/#the-full-setup-first-sign-in) and [Reverse proxy](/docs/operator/reverse-proxy/#the-full-setup-behind-https).

## From local mode to OIDC mode

The same image and the same data: set `AUTH_MODE=oidc` and the provider's variables in `.env`, then restart. `AUTH_MODE` is a C1 variable: it is never changed from the administration.

Local-mode accounts are named `local:<slug>`, the name in lower case without accents; an OIDC account is a different account, even with the same name. To hand a quiz from one to the other, use `./quizdock quiz:transfer <quiz-id> <sub|email>` once the new account has signed in. See [Command line](/docs/operator/cli/).

## When it fails

The log lines and their fixes are in [Troubleshooting](/docs/operator/troubleshooting/#sign-in-with-openid-connect).

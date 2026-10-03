---
title: Troubleshooting
description: Symptoms, causes and fixes for a QuizDock instance — start-up, configuration, network and phones, reverse proxy, administration, media, sound and OpenID Connect sign-in.
sidebar:
  order: 16
---

Start with `./quizdock status` and `./quizdock doctor`, on the server, in the instance's folder: most problems show there. Then find the symptom below.

## Start-up

| Symptom | Cause | Fix |
|---|---|---|
| `./quizdock up` ends with `the app is not healthy yet` | The application did not answer `/health` within 120 seconds | `./quizdock logs`: look for the first `ERROR`, or a failed `migrate` (`./quizdock logs migrate`). |
| `no .env here — run ./quizdock init first` | The script runs from another folder | `cd` to the instance's folder. |
| `cannot talk to the Docker daemon` | Docker is stopped, or the user is not allowed to use it | Start Docker; add the user to the `docker` group, or use root. |
| The instance is down after a reboot | It was stopped with `./quizdock down`, or its `docker-compose.prod.yml` predates 0.13.1 (no restart policy) | `./quizdock up`; take the current `docker-compose.prod.yml` from the release. |
| `doctor`: `… pending … run the migrate step` | The migrations did not run, or failed | `./quizdock logs migrate`, then `./quizdock up`. |
| `doctor`: `PostgreSQL: …` or `Redis: …` | The database or the cache is down or unreachable | `./quizdock status`; `./quizdock logs postgres` or `redis`. |
| `doctor`: `/data/media: …` (not writable) | The volume's permissions are wrong | The folder must belong to uid `65532`. A fresh named volume gets it by itself; a folder mounted from the server needs `chown 65532:65532`. |
| The application fails to connect to PostgreSQL after `POSTGRES_PASSWORD` was changed | PostgreSQL keeps the password it was created with | Put the former password back in `.env`, or change it inside PostgreSQL first. |

## Configuration

| Symptom | Cause | Fix |
|---|---|---|
| A value changed in `.env` has no effect (Compose) | The containers were not recreated | `./quizdock up`. |
| A value changed in `.env` has no effect (standalone) | A container keeps the environment it was created with | `docker rm -f quizdock`, then `./quizdock up`. The data stays in the volume. |
| A value differs from `.env` | It was changed in the administration, which wins over `.env` | **Back to .env** in **Administration → Settings**, or `./quizdock qd settings.reset --key=NAME`. |
| An override broke the instance and the administration is out of reach | — | `ADMIN_OVERRIDES=ignore` in `.env` and restart; take the override back (`./quizdock qd settings.reset --key=NAME`), then remove `ADMIN_OVERRIDES` and restart. |
| `WARN [Settings] … cannot be read` | A typo or a wrong format | Fix the value: the default is used meanwhile. On a C1 variable, from v1 the instance will refuse to start. |
| A variable in `.env` never reaches the application (Compose) | The Compose file passes only the variables it lists | Use the variables of the [reference](/docs/operator/configuration/). |

## Network and phones

| Symptom | Cause | Fix |
|---|---|---|
| The console offers no local address | Docker Desktop, or a bridge network, hides the server's addresses | `HOST_LAN_IPS=<the server's address>`, or type it under **Other address…**. |
| Phones cannot open the invitation address | Not the same network, a firewall, or a guest Wi-Fi isolating its clients | Test it from **Administration → Health**; open the port in the firewall. See [Networking](/docs/operator/networking/). |
| Phones warn about the address | An `http://` address offered from an HTTPS page | Offer the public HTTPS address (`APP_PUBLIC_URL`). |
| Players are refused for wrong PINs as a group | Behind a proxy, every player shares the proxy's address | Set `TRUST_PROXY` so the client's address is read. See [Reverse proxy](/docs/operator/reverse-proxy/#trust_proxy-who-may-speak-for-the-client). |
| The update notice never shows | `UPDATE_CHECK=false`, or GitHub unreachable | **Administration → Health** says which. |

## Reverse proxy

| Symptom | Cause | Fix |
|---|---|---|
| Uploads or imports fail with `413` | The proxy's request body limit | nginx: `client_max_body_size 64m;`. |
| Behind a proxy, players never connect, or games lag | WebSocket upgrades not passed on `/socket.io/` | Pass `Upgrade` and `Connection`. See [Reverse proxy](/docs/operator/reverse-proxy/). |
| `403 auth.cross_origin` | A change requested from another origin (another port, a sibling subdomain) | Open QuizDock at one address only. |
| The game socket is refused from a page | The page is served from another origin than the socket | Serve pages, API and socket from one origin. |

## Administration

| Symptom | Cause | Fix |
|---|---|---|
| The administration shows the settings but changes nothing | `ADMIN_WEB_SCOPE=read`, the default | `ADMIN_WEB_SCOPE=write` in `.env`, then restart. |
| Local mode: the administration changes nothing | `ADMIN_TOKEN` is unset, or shorter than 32 characters and so ignored | Set a token of 32 characters or more, restart, and give it in the administration when asked. |
| A setting cannot be changed from the administration | It is C1, or named in `ADMIN_LOCK` | Change it in `.env`. |
| The setup token is lost, expired or refused | It works once, for 24 hours, and each start replaces it | The last one in the log, or `./quizdock qd setup.token`. |
| The wizard is closed and is needed again | — | `./quizdock qd setup.reopen`. |
| Nobody can take the host seat (local mode) | Someone holds it without expiry | `./quizdock seat:release`. |
| An account cannot host | No `host` role | `./quizdock user:set-role <sub\|email> host`, or give the role in the provider. |

## Media and sound

| Symptom | Cause | Fix |
|---|---|---|
| Quizzes show missing images after a restore | The database and the media come from different backups | Restore both from the same backup. |
| The projection is silent | The browser plays sound only after a click in the projection window | Click **Turn sound on** on the projection, or allow the instance on a dedicated computer: see [Security](/docs/operator/security/#projection-computers-allow-sound-for-your-instance-only). |

## Sign-in with OpenID Connect

| Symptom (in the application's log) | Fix |
|---|---|
| `unexpected "iss" claim value` | `OIDC_ISSUER` differs from the tokens' `iss`. Match it exactly, scheme, host, port and trailing slash: copy the `issuer` of the discovery document. The log warns at the first discovery after a start (the first sign-in or token check) when they differ, and says when only a trailing slash does. |
| `signature verification failed` | The keys are wrong or unreachable: check that the backend reaches `<OIDC_ISSUER>/.well-known/openid-configuration`, or `OIDC_INTERNAL_URL`. |
| `fetch failed`, at sign-in | The backend cannot reach the issuer's host (Docker networking): set `OIDC_INTERNAL_URL` to the internal address. |
| `OIDC discovery failed: … → HTTP …` | The provider answered the discovery request with an error: check the address in the line. |
| `Sign-in failed: invalid_client` or `unauthorized_client` | The client is confidential on the provider: set `OIDC_CLIENT_SECRET`, or make the client public with PKCE. |
| `Sign-in failed: … "iss" claim` after the redirect | The provider names itself after the address that asked (the internal one): give it a fixed public host name (Keycloak: `KC_HOSTNAME`). |
| The session cookie has no `Secure` flag behind HTTPS | The proxy's `X-Forwarded-Proto` is not believed: name the proxy in `TRUST_PROXY`. |
| `403 auth.host_required` | The user is signed in but has no `host` role in the claim `OIDC_ROLES_CLAIM` points at. |
| `unexpected "aud" claim value` | The tokens' `aud` differs from `OIDC_AUDIENCE`: fix it, or leave `OIDC_AUDIENCE` empty. |
| A redirect loop, or `invalid redirect_uri` | Add `<origin>/auth/callback` to the client's valid redirect URIs. |
| Signed out after a while | Refresh tokens are not issued, or the session was unused for 24 hours: issue refresh tokens for the client. |

Still stuck: `./quizdock doctor` output and the first `ERROR` of `./quizdock logs quizdock` are what to look at, and what to give when you ask for help.

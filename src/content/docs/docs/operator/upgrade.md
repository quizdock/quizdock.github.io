---
title: Upgrade
description: Upgrade QuizDock with ./quizdock upgrade — how a new release is announced, what the command does, why there is no rollback, and the notes for each version.
sidebar:
  order: 12
---

A new release is a new image. Its database migrations run by themselves at start. This page upgrades an instance and lists what to know for each version.

## Know when a release is out

With `UPDATE_CHECK=true` (the default), the instance asks GitHub at most once a day for the latest stable release:

- **In the administration**, a notice above the pages says **QuizDock X.Y.Z is available.**, with the command to run, the release notes (**What's new**, **Before upgrading**) and **Hide until the next version**. It installs nothing.
- **On the server**, `./quizdock status` and `./quizdock version` print `Update available: ./quizdock upgrade X.Y.Z`.

GitHub sees the server's IP address; nothing else is sent. To turn it off, set `UPDATE_CHECK=false`. See [Networking](/docs/operator/networking/#outgoing-connections).

## Before you upgrade

1. **Read the release's notes**, linked from the notice (**Before upgrading**). Every release lists its schema changes and anything to do by hand under *Upgrading*. When that section is absent, nothing is required.
2. **Read the [version notes](#version-notes)** below for every release between yours and the new one.
3. **Pick a quiet moment.** The application restarts: games in progress may be lost.

## Upgrade

On the server, in the instance's folder:

```sh
./quizdock upgrade 0.14.0
```

It:

1. takes a backup into `./backups/` (see [Back up an instance](/docs/operator/backup/));
2. writes the new tag in `.env` as `QUIZDOCK_TAG`, so that later `up` runs it;
3. Compose and full: fetches the release's Compose files (and, for full, the Keycloak realm). A file you edited is kept, and the release's version is written next to it as `<file>.new`: compare, then keep yours or adopt it (`mv docker-compose.prod.yml.new docker-compose.prod.yml`);
4. pulls the images;
5. restarts the instance: the `migrate` service applies the migrations, then the application starts;
6. prints the last 20 lines of the migration's output;
7. waits for `/health`;
8. runs `doctor`.

Without a tag, `upgrade` pulls the tag already in `.env` again: with `latest`, that is the latest release.

**Standalone:** the script pulls the standalone image of that release (`standalone-0.14.0`, or `standalone` when the tag is `latest`), then recreates the container; the data stays in the `quizdock` volume.

Check the result with `./quizdock status`, and the migrations with `./quizdock migrate:status`.

## No rollback

Migrations change the database, and some convert data, not just the schema. Once a newer release's migrations have run, the database is not meant for an older image. To go back, restore the backup `upgrade` took, **database and media together**. In Compose and full, on the server, in the instance's folder:

1. Set the older `QUIZDOCK_TAG` in `.env`.
2. Restore the backup taken just before the upgrade:

   ```sh
   ./quizdock restore ./backups/quizdock-<date>
   ```

   The restore starts the application again at the end, on the tag now in `.env`.
3. `./quizdock doctor`

Everything done since the upgrade is lost. See [Restore an instance](/docs/operator/restore/).

## Upgrade by hand (Compose)

On the server, in the instance's folder:

```sh
./quizdock backup
# set QUIZDOCK_TAG=0.14.0 in .env, then:
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml logs migrate
./quizdock doctor
```

On a server without Internet access: see [Air-gapped installation](/docs/operator/air-gapped/#upgrade-offline).

## Version notes

What changes for an operator, by release. Read every note between your version and the new one.

### From v1: a broken C1 variable refuses to start

Since 0.13, the application logs every variable it cannot read (it uses the default instead) or that is out of range (it uses it as is), and `doctor` lists them. A critical one (level C1, for example `AUTH_MODE=OIDC` instead of `oidc`) is only a warning for now. **From v1, the instance will refuse to start** with it. Fix what the log names before then. See [Configuration](/docs/operator/configuration/#warnings-at-start).

### 0.14: the host's interface language

One migration, applied on start: `user.locale` becomes the host's interface language, chosen under **My account**. Its old default (`fr`) was never chosen by anyone, so every account starts with none and follows the instance's language (`APP_LANG`). No setting, `.env` or Compose file changes.

### 0.13.2: download the quizdock script again

The `quizdock` script of earlier releases does not fetch a release's Compose files. Download it again before upgrading, in the instance's folder:

```sh
curl -fsSLO https://raw.githubusercontent.com/quizdock/quiz-dock/main/quizdock
./quizdock upgrade
```

On this first run, your Compose files are kept and the release's are written next to them as `<file>.new`: compare, then adopt them. Until you do, the release's Keycloak (full preset) and its container hardening stay out, and Health says your Compose files are older than the image. The single image (`standalone`) has no Compose files: nothing to do.

### 0.13: the setup wizard

A fresh instance offers a setup wizard in the browser, behind a setup token written in the log at start. An instance already in use when it is upgraded is considered set up: nothing to do. An automated deployment of a fresh one skips the wizard with `./quizdock qd setup.complete`.

### 0.13: the pages and the API on one origin

The API and the game socket answer the application's own pages only, served from the same origin. Every setup described here does so. A setup of your own that serves the pages from another origin must put them behind the same one. See [Reverse proxy](/docs/operator/reverse-proxy/#the-same-origin-rule).

### 0.10: game sounds off in a new room

The tick, the gong, the countdown and the ding start off in a room opened after the upgrade: the host turns on the ones they want from the console. No migration.

### 0.9: upgrade between two games

The live state of a game moved into its room (several quizzes under one PIN): a game in progress during the upgrade is lost. Players join again.

### 0.9: OIDC_ISSUER taken as written

OIDC mode only. Earlier releases dropped a trailing slash from `OIDC_ISSUER`; it is now compared with the tokens' `iss` exactly, as the standard requires. If yours ends with `/` and your provider's issuer does not (or the reverse), sign-in fails with `unexpected "iss" claim value`: set it to the `issuer` of your provider's discovery document. The log and `doctor` point out a difference of a trailing slash.

### 0.8: media files renamed

From this release each file is stored once, named after its SHA-256. On its first clean-up pass the backend renames the existing files (`older files moved to shared storage` in the log); the media are served throughout. Going back to an older release then means restoring the database **and** the media volume from the same backup.

### 0.8: the OIDC session held by the backend

OIDC mode only. Local mode and the standalone image without OIDC: nothing to do.

**Variables**

| Variable | Change | Action |
|---|---|---|
| `OIDC_SESSION_SCOPE` | Removed (ignored, with a warning in the log) | Delete it. |
| `OIDC_INTERNAL_URL` | New, optional | Set it when the backend reaches the provider at another address than the browser (Docker network). |
| `OIDC_CLIENT_SECRET` | New, optional | Set it if the client is confidential. A public client with PKCE: leave it unset. |
| `TRUST_PROXY` | New, optional | Set it if the reverse proxy is not on a private address. |
| `OIDC_JWKS_URI` | Unchanged | On another host than the issuer, its host is used as `OIDC_INTERNAL_URL`. |
| `OIDC_CLIENT_ID` | Now used by the backend | Nothing to do. |

**Identity provider**

| Item | Action |
|---|---|
| Redirect URI `https://<instance>/auth/callback` | Unchanged. |
| Post-logout redirect URI `https://<instance>` | Unchanged. |
| Web origins (CORS) | No longer needed. |
| Refresh tokens | Must be issued, or the session ends with the first access token. |
| Issuer seen from the backend | Must equal `OIDC_ISSUER`, even when reached through `OIDC_INTERNAL_URL`. Keycloak: `KC_HOSTNAME=<public URL>` and `KC_HOSTNAME_BACKCHANNEL_DYNAMIC=true`. |
| Network | The backend must reach the token endpoint, not only the keys. |

**After the upgrade**

1. `./quizdock doctor` shows `discovery ok → token endpoint …` and `JWKS reachable`.
2. Every user signs in once: earlier sessions are not carried over.
3. A second tab stays signed in.
4. Logging out makes the provider ask for credentials again.

**What changes for users**

| Before | After |
|---|---|
| Tokens in the browser | Tokens in Redis; the browser holds an `httpOnly` cookie. Old browser tokens are deleted at start. |
| Session kept after closing the browser | The session ends with the browser; signing in again is usually one click (the provider's session). |
| Name in the header from the ID token's `name` | The same name as in the lobby: `OIDC_NAME_CLAIM`, then `preferred_username`, `name`, `email`. |
| The provider allowed in the Content-Security-Policy | Removed: requests to the instance only, no frames. |
| A write from another origin of the same site went through | `403 auth.cross_origin`; a socket from another origin stays a guest (refused since [0.13](#013-the-pages-and-the-api-on-one-origin)). |

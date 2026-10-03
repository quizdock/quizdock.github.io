---
title: Security
description: How the QuizDock images are hardened and scanned, what each sign-in mode protects, the settings that limit the administration, and how to report a vulnerability.
sidebar:
  order: 14
---

This page is for the person responsible for a QuizDock instance: what the images do to protect themselves, what you must do, and how to report a vulnerability.

## Supported versions

QuizDock is in `0.x`. Security fixes go into the **latest release only**. Run a recent tag, and watch for the update notice (see [Upgrade](/docs/operator/upgrade/)). Each release rebuilds the standalone image with Debian's security updates applied at build time.

## Report a vulnerability

Do not open a public issue. Open a [private security advisory](https://github.com/quizdock/quiz-dock/security/advisories/new) on the QuizDock repository, with the affected version, the steps to reproduce and the impact. There is no bounty; fixes are prioritised and disclosed once a patched release is out.

## The images

**Application image** (`fchaussin/quizdock:X.Y.Z`, `latest`):

- Built on Google's distroless Node.js 24 image (Debian 13): no shell, no package manager.
- Runs as a non-root user (uid `65532`).

**In the Compose file**, the application container also runs with:

- a read-only root filesystem, the media and templates on volumes, `/tmp` in memory;
- every Linux capability dropped;
- `no-new-privileges`.

PostgreSQL and Redis sit on an internal Docker network and are not published on the server. Only the application's port is, plus Keycloak's in the full setup.

**Standalone image** (`fchaussin/quizdock:standalone`): Debian with Node.js, PostgreSQL and Redis in one container, running as a non-root user. It is **not hardened** like the Compose setup: no read-only filesystem, no dropped capabilities. Its PostgreSQL trusts local connections and listens on `127.0.0.1` inside the container only. Use it for trying and small events, not for serious production. A plain `docker run` of the application image does not get the Compose file's restrictions either; add them yourself.

## Scanning

On every push to the development and main branches, every pull request, and every week:

- `pnpm audit` blocks high and critical vulnerabilities in the application's dependencies;
- Trivy scans the source tree for vulnerabilities, misconfigurations and secrets;
- Trivy scans the published `latest` and `standalone` images, which catches a base image that drifted since the release.

## What you are responsible for

- **Secrets.** `.env` holds the database password and, in the full setup, Keycloak's passwords. `./quizdock init` generates them at random and writes `.env` readable by its owner only. A Compose file started without `.env` falls back to the password `live`: never do that on a reachable server.
- **Backups.** They hold `.env` and personal data. See [Back up an instance](/docs/operator/backup/).
- **HTTPS.** Put a reverse proxy with a certificate in front of any instance reachable from outside. See [Reverse proxy](/docs/operator/reverse-proxy/).
- **Updates.** The images do not update themselves.

## What each sign-in mode protects

**Local mode** (`AUTH_MODE=none`) has no accounts. The host seat is taken by typing a name, and typing the same name again gets it back, on any device: it is **not a security boundary**. Use local mode on networks you trust. Participants need only the PIN and a nickname.

**OIDC mode** (`AUTH_MODE=oidc`):

- The backend holds the tokens; the browser holds only a random session id in an `httpOnly`, `SameSite=Lax` cookie, `Secure` over HTTPS. A script injected into a page has no token to steal. Redis stores only a hash of the session id.
- Requests that change something, and the game socket, are accepted with the cookie only from the application's own pages.
- Every host action checks the `host` role, every administration action the `admin` role.

See [Sign-in with OpenID Connect](/docs/operator/oidc/).

## Limiting the administration

| Setting | Effect |
|---|---|
| `ADMIN_WEB_SCOPE=read` (default) | The web administration shows the instance's settings, accounts and host seat, and changes none of them. `write` allows changes, each critical one confirmed. |
| `ADMIN_LOCK` | Variables the web administration never changes. |
| `ADMIN_TOKEN` | Local mode: the web administration changes nothing (the media library aside) until this token, 32 characters or more, is set and given. Kept in the browser tab only. |
| Level C1 | Start-up, data and security variables are never changed from the web, nor by `qd`. |

Wrong administration tokens are limited to 10 per address and 50 in total per 15 minutes; the administration API to 120 calls a minute. Every administrative action, and every refusal, is recorded in the audit, which is never edited or deleted. See [Audit](/docs/admin/audit/).

`qd` in the container is not limited by these settings: access to the container, or to the Docker daemon, is full control of the instance. Give it accordingly.

## Other protections

- **Content-Security-Policy on every page:** scripts, styles, fonts and requests from the instance only; no inline script, no `eval` (WebAssembly is allowed for the in-browser media converter); no frames; the pages cannot be embedded by another site. Images may come from `https:` addresses, for the images a quiz's text points to.
- **Wrong PINs:** 30 a minute per client address. Behind a proxy, set `TRUST_PROXY` so the address is the client's. See [Reverse proxy](/docs/operator/reverse-proxy/#trust_proxy-who-may-speak-for-the-client).
- **Uploads** are checked by their content, not their name; SVG is refused.
- **The setup token** works once and expires 24 hours after it was created. Each start while the setup is open, and each `qd setup.token`, replaces it.

## Projection computers: allow sound for your instance only

A browser plays sound only after a click in that very window, so the projection asks for one. On a computer dedicated to the projector, the browser can allow QuizDock to play sound without the click.

The recommended way allows your instance only: the `AutoplayAllowlist` policy of Chrome and Edge.

- **Linux (Chrome):** create `/etc/opt/chrome/policies/managed/quizdock.json` (Chromium: `/etc/chromium/policies/managed/`):

  ```json
  { "AutoplayAllowlist": ["https://quiz.example.org"] }
  ```

- **Windows:** in the registry, or with Group Policy (*Allow media autoplay on specific sites*):

  ```text
  HKLM\SOFTWARE\Policies\Google\Chrome\AutoplayAllowlist\1 = "https://quiz.example.org"
  HKLM\SOFTWARE\Policies\Microsoft\Edge\AutoplayAllowlist\1 = "https://quiz.example.org"
  ```

- **macOS:** deploy the same key with a configuration profile for `com.google.Chrome` or `com.microsoft.Edge`.

Use the address the projection opens (your `APP_PUBLIC_URL`, or `http://<LAN address>:<port>`). Restart the browser, then check `chrome://policy` or `edge://policy`. The policy does not exist on Android or iOS.

The launch flag `--autoplay-policy=no-user-gesture-required` does the same for **every** site the browser opens. Keep it to a computer used for nothing else, or to a separate browser profile (`--user-data-dir=…`). See [Sound and projection](/docs/host/sound-and-projection/) for the host's side.

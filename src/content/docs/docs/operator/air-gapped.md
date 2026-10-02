---
title: Air-gapped installation
description: Run QuizDock on a network without Internet access — what works offline, the settings to choose, and how to bring the images and files in.
sidebar:
  order: 7
---

QuizDock runs on a network with no Internet access. This page says what to turn off, and how to bring the images and files to a server that cannot download them.

## What works offline

Everything a game needs runs on the server: the application, PostgreSQL, Redis, the media, the templates. The pages load no script, font or style from elsewhere: the Content-Security-Policy limits scripts, styles, fonts and requests to the instance's own origin.

With these three conditions, the server makes no outgoing request:

1. **The quick setup's offline answer.** It sets `UPDATE_CHECK=false` and `MEDIA_LIBRARY_LINKS=none` (the editor's links to free media libraries are hidden). Choose **offline** in the setup wizard, or on the server, in the instance's folder:

   ```sh
   ./quizdock qd presets.apply --internet=offline --dry-run   # preview
   ./quizdock qd presets.apply --internet=offline
   ```

   Or put both variables in `.env`.
2. **Local mode, or an identity provider on your own network.** In OIDC mode, the backend talks to the provider for discovery, tokens and keys.
3. **The community catalogue left off.** `QUIZ_STORE_URL` is empty by default: keep it so.

Browsers also follow two kinds of links the server does not: the feedback links on the home page (set `APP_FEEDBACK_URL=none` to hide them) and images a quiz's text points to on the web (they simply do not show offline).

The database migrations run offline too: the image carries everything they need.

## Bring the images in

:::note
This is standard Docker, not a QuizDock tool: `docker save` writes images to a file, `docker load` reads them back. Any other way your organisation moves images into an isolated network (a private registry, for example) works the same.
:::

1. On a machine with Internet access, pull the images for the release you install, and save them to one file. For the Compose setup (replace `0.13.0` with your release):

   ```sh
   docker pull fchaussin/quizdock:0.13.0
   docker pull postgres:16-alpine
   docker pull redis:7-alpine
   docker save -o quizdock-images.tar fchaussin/quizdock:0.13.0 postgres:16-alpine redis:7-alpine
   ```

   For the full setup, add `quay.io/keycloak/keycloak:26.0.8`. For the standalone setup, the one image `fchaussin/quizdock:standalone-0.13.0` is enough. Check the exact image names and tags in the `docker-compose.prod.yml` of the release you install.
2. Copy `quizdock-images.tar` to the server.
3. On the server, load them:

   ```sh
   docker load -i quizdock-images.tar
   ```

## Bring the files in

`./quizdock init` downloads the Compose files from `raw.githubusercontent.com` when they are not in the folder already. On the machine with Internet access, download these files, then copy them into the instance's folder on the server:

| File | For |
|---|---|
| `quizdock` | Every setup |
| `docker-compose.prod.yml` | Compose and full |
| `docker-compose.full.yml` and `keycloak/realm-export.json` | Full |
| `env/local.env.example`, `env/oidc.env.example`, `env/full.env.example` or `env/standalone.env.example` | A commented `.env` to start from, if you do not use `init` |

All of them are at `https://raw.githubusercontent.com/quizdock/quiz-dock/main/<file>`. Take them from the release tag you install rather than `main` when the two differ.

Then, on the server, in the instance's folder:

1. Pin the release you loaded: run `./quizdock init` (it finds the files and downloads nothing), then set `QUIZDOCK_TAG=0.13.0` in `.env`.
2. Start it: `./quizdock up`. Docker uses the loaded images and pulls nothing.

For the standalone setup, `./quizdock up` runs the image tagged `standalone`: tag the loaded image so (`docker tag fchaussin/quizdock:standalone-0.13.0 fchaussin/quizdock:standalone`), or start it with `docker run` as in [Install](/docs/operator/install/#with-docker-run-standalone).

## Upgrade offline

`./quizdock upgrade` pulls from Docker Hub, which fails without Internet. Do its steps by hand, on the server, in the instance's folder:

1. Load the new release's images, as above.
2. `./quizdock backup`
3. Set the new `QUIZDOCK_TAG` in `.env`.
4. `./quizdock up` (the migrations run at start).
5. `./quizdock doctor`

Read the release's notes first: see [Upgrade](/docs/operator/upgrade/).

## The MCP connector

The experimental quiz-conversion connector runs as a local process through Docker or SSH and makes no outgoing request itself. See [Command line](/docs/operator/cli/#annex-the-mcp-connector-experimental).

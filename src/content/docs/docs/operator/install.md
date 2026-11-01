---
title: Install QuizDock
description: Install QuizDock with the quizdock script, with a single docker run, or with Docker Compose by hand, then finish the setup in the browser.
sidebar:
  order: 2
---

This page installs a new instance. Pick the setup first in [Choose a deployment](/docs/operator/choose-a-deployment/). The script is the shortest path, and the only one that also backs up, restores and upgrades for you.

## Prerequisites

- **Docker Engine with the Compose plugin** (`docker compose`), or Docker Desktop on a Mac or a PC.
- **curl**, for the script to download its files.
- A user allowed to talk to the Docker daemon (in the `docker` group, or root).
- One free TCP port on the server for the application (`18080` by default), and a second one for Keycloak or Authentik in the full setup (`18081` by default).

Memory and CPU: see [Sizing](/docs/operator/sizing/).

## With the quizdock script

1. On the server, create an empty folder for the instance and go into it. Everything the instance needs lives there: `.env`, the Compose files, the backups.

   ```sh
   mkdir -p /srv/quizdock && cd /srv/quizdock
   ```

2. Download the script and make it executable:

   ```sh
   curl -fsSLO https://raw.githubusercontent.com/quizdock/quizdock/main/quizdock
   chmod +x quizdock
   ```

   The script is also [available as a raw file](https://raw.githubusercontent.com/quizdock/quizdock/main/quizdock) to read before running it.

3. Run **one** of these, for the setup you chose:

   ```sh
   ./quizdock init --standalone   # one container
   ./quizdock init                # Compose: answer "none" (local mode) or "oidc" (your provider)
   ./quizdock init --full         # Compose with a bundled identity provider: Keycloak or Authentik
   ```

   `init` with no option is the same as `init --compose`. It asks for the application name, the language and the HTTP port; then the sign-in mode, except with `--full`, which signs in with its bundled provider; with `oidc`, your provider's issuer and client id; with `--full`, which provider, `keycloak` (the default) or `authentik`, the host name browsers will use and the provider's port; and whether administrators may change settings from the browser (`ADMIN_WEB_SCOPE`, see [Allow changes from the web](/docs/admin/overview/#allow-changes-from-the-web)): answered yes in local mode, it also generates the administration token (`ADMIN_TOKEN`) and says where it is. It then:

   - writes `.env` with permissions `600`; for Compose and the full setup, with a random PostgreSQL password (and, in the full setup, random passwords for the provider's administrator and the two sample accounts, and with Authentik its secret key and QuizDock's client secret);
   - remembers the setup in `.env` as `QUIZDOCK_MODE`, and the full setup's provider as `QUIZDOCK_IAM`;
   - downloads `docker-compose.prod.yml` for Compose, plus, for the full setup, `docker-compose.full.yml` and `keycloak/realm-export.json` with Keycloak, or `docker-compose.authentik.yml` and `authentik/quizdock.yaml` with Authentik, when they are not already in the folder.

   `--iam=keycloak` or `--iam=authentik` chooses the provider without the question, and implies `--full`.

   An existing `.env` is only replaced after you confirm.

4. Start the instance:

   ```sh
   ./quizdock up
   ```

   `up` starts the containers, then waits up to 120 seconds for the application's `/health` to answer (and, in the full setup, up to 180 seconds more for Keycloak, 300 for Authentik, which prepares its database on its first start). It prints the address when the instance is ready.

5. Open `http://<server>:18080` in a browser and finish the setup. See [Finish the setup in the browser](#finish-the-setup-in-the-browser).

## With docker run (standalone)

The all-in-one image needs nothing else. On the machine that runs Docker:

```sh
docker run -d --name quizdock --restart unless-stopped \
  -p 18080:3000 -v quizdock:/data fchaussin/quizdock:standalone
```

- `-v quizdock:/data` keeps the database, the media and the templates in a named volume. Without it, everything is lost with the container.
- To set variables, add `--env-file .env`. A commented starting point is `env/standalone.env.example` in the QuizDock repository, also downloadable as `https://raw.githubusercontent.com/quizdock/quizdock/main/env/standalone.env.example`.
- The first start creates the database and runs the migrations: allow a minute before `/health` answers.

The `./quizdock` script manages a container started this way if it is named `quizdock` and the folder has a `.env` with `QUIZDOCK_MODE=standalone`.

## With Docker Compose by hand

1. On the server, in the instance's folder, download the Compose file and a commented `.env` to start from:

   ```sh
   curl -fsSLO https://raw.githubusercontent.com/quizdock/quizdock/main/docker-compose.prod.yml
   curl -fsSL -o .env https://raw.githubusercontent.com/quizdock/quizdock/main/env/local.env.example
   chmod 600 .env
   ```

   For your own provider, take `env/oidc.env.example` instead of `env/local.env.example`.

2. Edit `.env`: at least replace `POSTGRES_PASSWORD`. Without a `.env`, the Compose file falls back to the user and password `live`.
3. Start it:

   ```sh
   docker compose -f docker-compose.prod.yml up -d
   ```

   The `migrate` service applies the database migrations and exits; the application starts once it has succeeded.

For the full setup with Keycloak, also download `docker-compose.full.yml` and `keycloak/realm-export.json` (into a `keycloak/` folder), start from `env/full.env.example`, replace its passwords, and start with:

```sh
docker compose -f docker-compose.prod.yml -f docker-compose.full.yml --profile keycloak up -d
```

With Authentik, download `docker-compose.authentik.yml` and `authentik/quizdock.yaml` (into an `authentik/` folder), start from `env/authentik.env.example`, replace its secrets, and start with:

```sh
docker compose -f docker-compose.prod.yml -f docker-compose.authentik.yml up -d
```

The script works on a folder set up by hand: without `QUIZDOCK_MODE` in `.env`, it assumes Compose.

## Finish the setup in the browser

A fresh instance offers a setup wizard: usage, health, identity, address, access, limits, content, then a summary. It asks for a **setup token** first, so that whoever reaches a fresh instance cannot take it over. The token is written in the application's log at start:

```sh
./quizdock logs quizdock    # Compose; for standalone: ./quizdock logs
```

Look for the line `This instance is not set up yet. Open it in a browser and give the setup token …`, then stop following the log with Ctrl+C. The token works once and expires 24 hours after it was created. Each start, while the setup is open, writes a new one and the previous one stops working. A new one, on the server, in the instance's folder:

```sh
./quizdock qd setup.token
```

An automated deployment configured entirely in `.env` skips the wizard with `./quizdock qd setup.complete`. What the wizard sets, and what it never touches: see the [administration overview](/docs/admin/overview/).

## The full setup: first sign-in

- The host name you gave `init --full` (`PUBLIC_HOST`) is used by every browser, for QuizDock and for its provider, on their two ports. `localhost` only works on the server itself: on a network, use the server's LAN address or a name every device resolves.
- Two sample accounts exist: `host` (Alex Host, roles `host` and `admin`) and `player` (Sam Player, role `player`).
- The provider reads these passwords only on its first start, into an empty database: changing them in `.env` later changes nothing.

With **Keycloak**:

- The passwords are temporary, in `.env` as `KEYCLOAK_HOST_PASSWORD` and `KEYCLOAK_PLAYER_PASSWORD`; each account must choose a new one at first sign-in.
- The Keycloak administration console is on the Keycloak port, with `KEYCLOAK_ADMIN` and `KEYCLOAK_ADMIN_PASSWORD`. Create the other accounts there, and give them QuizDock's roles as roles of the `quiz-dock-frontend` client.

With **Authentik**:

- The passwords are in `.env` as `AUTHENTIK_HOST_PASSWORD` and `AUTHENTIK_PLAYER_PASSWORD`. Authentik does not ask for a new one: change them in its interface before opening the instance to others, or remove the two accounts.
- Authentik's administration is on the Authentik port, as `akadmin` with `AUTHENTIK_ADMIN_PASSWORD`. Create the other accounts there, and give them QuizDock's roles by putting them in the groups *QuizDock admins*, *QuizDock hosts* or *QuizDock players*.

What the bundled realm and blueprint contain: see [The bundled Keycloak](/docs/operator/oidc/#the-bundled-keycloak) and [The bundled Authentik](/docs/operator/oidc/#the-bundled-authentik).

HTTPS in the full setup: see [Reverse proxy](/docs/operator/reverse-proxy/#the-full-setup-behind-https).

## After a reboot

The application, PostgreSQL and Redis come back by themselves after the server or Docker restarts (the Compose file gives them `restart: unless-stopped`). An instance stopped with `./quizdock down` stays stopped until `./quizdock up`. A standalone container created by the script (or with `--restart unless-stopped`, as above) comes back by itself too.

## Next

- [Networking](/docs/operator/networking/): make sure phones reach the invitation address.
- [Configuration](/docs/operator/configuration/): every variable.
- [Back up an instance](/docs/operator/backup/), before the first real event.

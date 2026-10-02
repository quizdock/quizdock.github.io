---
title: Choose a deployment
description: The four ways to run QuizDock — standalone, Compose, Compose with your identity provider, full — what each runs and when to pick it.
sidebar:
  order: 1
---

QuizDock runs the same application in four setups. Pick one by how hosts sign in and how many services you are ready to operate. Every setup runs in Docker.

## The four setups

| Setup | What runs | Who hosts | Who takes part | Typical use | Limit |
|---|---|---|---|---|---|
| **Standalone** | One container: the application, PostgreSQL and Redis | One local host seat, taken with a name | PIN and nickname | A first try, a laptop, a one-off event | Not hardened, not for serious production |
| **Compose** | The application, PostgreSQL, Redis, and a one-shot migration service | One local host seat, taken with a name | PIN and nickname | A classroom or a team on a trusted network | A name is not a security boundary |
| **Compose with your identity provider** | The same, signing in against your OpenID Connect provider | Every account with the `host` role, as many as you like | Accounts, or PIN and nickname when a host opens the game | An organisation that already has single sign-on | You run and configure the provider yourself |
| **Full** | Compose plus a bundled Keycloak, with its own database in the same PostgreSQL | The sample `host` account, then the accounts you create in Keycloak | The sample `player` account, or PIN and nickname in an open game | Real accounts without an existing provider | One more service and one more database to maintain and back up |

The first two run in **local mode** (`AUTH_MODE=none`), the last two in **OIDC mode** (`AUTH_MODE=oidc`). The mode is one variable and a restart; see [Sign-in with OpenID Connect](/docs/operator/oidc/).

## How to choose

- **You want to see it work in five minutes:** standalone. Or try the [live demo](https://quizdock-standalone.onrender.com) first, without installing anything.
- **One person presents at a time, on a network you trust:** Compose in local mode. The host seat is taken by typing a name, and anyone who types the same name gets it back: keep it to trusted networks.
- **Several hosts, each with their own quiz bank, or an instance reachable from the Internet:** OIDC mode, with your provider or the bundled Keycloak.
- **Hundreds of players at once:** a Compose setup. The measured figures and their conditions are in [Sizing](/docs/operator/sizing/).

## What every setup shares

- **The image.** `fchaussin/quizdock` on [Docker Hub](https://hub.docker.com/r/fchaussin/quizdock), for `amd64` and `arm64`. One process serves the pages, the API and the game socket on port 3000: there is no separate web server to run.
- **The data.** PostgreSQL holds accounts, quizzes, settings changed in the administration and archived results. Redis holds the live state of games. Uploaded media and shared templates are files on volumes. See [Back up an instance](/docs/operator/backup/).
- **The administration.** The same web administration in every setup. See the [administration overview](/docs/admin/overview/).
- **The tools.** The `./quizdock` script on the server, and the `qd` command inside the container. See [Command line](/docs/operator/cli/).

## Image tags

| Tag | What it is |
|---|---|
| `X.Y.Z` (for example `0.13.0`) | One release of the application image. Pin this in production. |
| `X.Y` | The latest patch of that minor release. |
| `latest` | The latest release. |
| `standalone` | The latest release of the all-in-one image. |
| `standalone-X.Y.Z` | One release of the all-in-one image. |

Only a release publishes images: there is no nightly tag.

## The standalone image, in detail

The standalone image adds PostgreSQL, Redis and a small supervisor to the exact application build of the same release. Its limits:

- The database, the cache and the application share one container and one volume, mounted at `/data`.
- It is not hardened like the Compose setup: PostgreSQL and Redis write inside the container, so it cannot run with a read-only filesystem and dropped capabilities.
- Redis keeps nothing on disk there: restarting the container ends the games in progress.

## Not covered

The Documentation describes Docker setups only. Kubernetes, Helm, Podman, systemd units and running without Docker are not documented. Running against an external PostgreSQL or Redis is not documented either: the Compose file runs its own.

## Next

[Install QuizDock](/docs/operator/install/).

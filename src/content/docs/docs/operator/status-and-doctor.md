---
title: Status and doctor
description: Check that a QuizDock instance runs and is configured right — quizdock status, the /health endpoint, doctor's checks, migrations and the version check.
sidebar:
  order: 9
---

Three checks, from the quickest to the deepest: `status` says whether it runs, `/health` is what a monitor probes, `doctor` checks the configuration and everything the application depends on.

## quizdock status

On the server, in the instance's folder:

```sh
./quizdock status
```

It prints:

1. the containers and their state (`docker compose ps`, or the standalone container);
2. whether `http://localhost:<HTTP_PORT>/health` answers;
3. the version running and the latest stable release, when the update check is on.

```text
==> health: ok (http://localhost:18080)
QuizDock 0.12.0
Latest stable: 0.13.0
  ! Update available: ./quizdock upgrade 0.13.0
```

With `UPDATE_CHECK=false`, the last lines say `Update check off (UPDATE_CHECK=false).` When GitHub does not answer, they say the latest version is unknown. The same information is on **Administration → Health**. See [Upgrade](/docs/operator/upgrade/).

## The /health endpoint

`GET /health` is public and answers JSON:

```json
{ "status": "ok", "service": "quiz-dock-backend", "version": "0.13.0", "contracts": "…", "authMode": "none" }
```

- It says the application process answers, which version it runs and in which mode. It does not check PostgreSQL or Redis: `doctor` does.
- The images' health checks, the Compose file's and the script's `up` all use it.
- Point an external monitor at `https://<your instance>/health`.

## doctor

```sh
./quizdock doctor
```

It checks, in groups:

| Group | What it checks |
|---|---|
| **Environment** | `AUTH_MODE`, `APP_NAME`, `APP_LANG`; every value it cannot read or that is out of range; variables that contradict each other (the same warnings the application logs at start) |
| **Database** | PostgreSQL is reachable; how many migrations are applied; none pending, none failed |
| **Redis** | Redis is reachable |
| **Media** | `MEDIA_DIR` and `STORE_DIR` are writable |
| **OIDC** (OIDC mode only) | Whether participants need accounts; the issuer, client and roles claim in use; the discovery document and its token endpoint, reached through `OIDC_INTERNAL_URL` when set; the keys (JWKS); a difference between the discovered issuer and `OIDC_ISSUER` |

Each line starts with `✓` (fine), `!` (a warning) or `✗` (a failure). It ends with `All checks passed.` or `Some checks failed.`, and exits with code 1 when something failed. A problem on a C1 variable is a failure; on other levels, a warning.

The same checks, grouped, are on **Administration → Health**. See [Health](/docs/admin/health/).

`./quizdock upgrade` and `./quizdock restore` run or suggest `doctor` at the end. The fixes for its messages are in [Troubleshooting](/docs/operator/troubleshooting/).

## Migrations

```sh
./quizdock migrate:status
```

Lists the migrations shipped in the image, applied, pending or failed. The migrations run by themselves at start: the `migrate` service in Compose, the entrypoint in standalone. To read their output in Compose:

```sh
./quizdock logs migrate
```

A pending migration after a start usually means the `migrate` service failed: its log says why.

## The version

```sh
./quizdock version
```

The version this image runs, and the latest stable release on GitHub, asked at most once a day and only when `UPDATE_CHECK` is on. When a newer one exists, it prints the `./quizdock upgrade <version>` that installs it.

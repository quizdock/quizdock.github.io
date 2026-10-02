---
title: Logs
description: Read QuizDock's logs with ./quizdock logs — which services log what, the format and levels, the lines worth looking for, and where the audit is instead.
sidebar:
  order: 15
---

QuizDock writes its log to the container's standard output, where Docker keeps it. This page says how to read it and what to look for.

## Read the logs

On the server, in the instance's folder:

```sh
./quizdock logs            # every service (Compose), or the container (standalone)
./quizdock logs quizdock   # the application only (Compose)
```

`logs` shows the last 200 lines, then follows: stop with Ctrl+C. Compose services:

| Service | What it logs |
|---|---|
| `quizdock` | The application |
| `migrate` | The database migrations, at each start |
| `postgres` | PostgreSQL |
| `redis` | Redis |
| `keycloak` | Keycloak (full setup) |

In the standalone container, one log carries the start-up steps (lines starting with `[standalone]`: database creation, migrations) and the application. Redis writes to `/tmp/redis.log` inside the container.

Without the script, `docker compose -f docker-compose.prod.yml logs <service>` or `docker logs quizdock` show the same.

## Format and levels

The application writes plain text lines, one event each, with a timestamp, a level and a context in brackets (`[Settings]`, `[Bootstrap]`…). Three levels are written: `LOG`, `WARN` and `ERROR`. There is no debug level, no setting to change the level, and no JSON output.

The Compose file sets no logging options: Docker's own defaults apply, including how much it keeps. Rotation is configured in Docker, not in QuizDock.

## Lines worth looking for

| Line | What it means |
|---|---|
| `WARN [Settings] …` at start | A variable QuizDock cannot read, out of its range, or contradicting another. See [Configuration](/docs/operator/configuration/#warnings-at-start). |
| `This instance is not set up yet. … give the setup token …` | A fresh instance: the token for the setup wizard. See [Install](/docs/operator/install/#finish-the-setup-in-the-browser). |
| `Instance already in use: the setup wizard is not offered.` | An instance upgraded from before the wizard: nothing to do. |
| `Overrides not loaded (…): the environment applies alone.` | The settings changed in the administration could not be read; `.env` applies alone. |
| `OIDC discovery failed: …` | The backend cannot reach your provider. See [Troubleshooting](/docs/operator/troubleshooting/#sign-in-with-openid-connect). |
| `discovery issuer "…" differs from OIDC_ISSUER "…"` | `OIDC_ISSUER` does not match the provider's issuer. |
| `Sign-in failed: …` | A sign-in refused by the provider or by the token checks. |
| `Media without their file (database older than …?): stored files kept` | The database is older than the media folder (a restore of one without the other). |
| `Files in … but no media in the database: stray files kept` | The media folder holds files and the database has no media: the clean-up deletes nothing. |
| `DEMO_MODE: shared host account "demo_user", uploads disabled, hourly reset` | The instance runs as a public demo. |
| `Redis: …` | The connection to Redis failed or dropped. |

## What is not in the logs

- **Administrative actions** (settings changed, roles granted, quizzes deleted, refusals) are in the **audit**, in the database: **Administration → Audit**, or `./quizdock qd audit.list`. See [Audit](/docs/admin/audit/).
- **Game results** are in the archived games, not in the log.

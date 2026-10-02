---
title: Back up an instance
description: What a QuizDock backup holds, how ./quizdock backup takes it while the instance runs, what it leaves out, and how to schedule it.
sidebar:
  order: 10
---

A QuizDock instance keeps its data in three places: the PostgreSQL database, the media folder and the shared templates folder. A backup takes all three at the same moment, with the configuration.

## What to keep

| Data | Where it lives | In `./quizdock backup` |
|---|---|---|
| Accounts, quizzes, settings changed in the administration, archived results, audit | PostgreSQL | Yes, `database.sql` |
| Keycloak accounts and configuration (full setup) | PostgreSQL, database `keycloak` | Yes, `keycloak.sql` |
| Uploaded images, videos, sounds | `MEDIA_DIR` (`/data/media`) | Yes, `media/` |
| Shared templates catalogue | `STORE_DIR` (`/data/store`) | Yes, `store/` |
| Configuration | `.env` | Yes, `env` |
| Your logo and stylesheet | The `branding/` folder you mount | **No**: keep a copy yourself |
| The live state of games in progress | Redis | No: it lasts as long as a game |

The media and the templates are files, not rows: a database without the matching media folder shows quizzes with missing images. Keep the three together.

## Take a backup

On the server, in the instance's folder:

```sh
./quizdock backup
```

Or into a folder of your choice:

```sh
./quizdock backup /mnt/backups/quizdock-before-event
```

What it does:

1. Dumps the QuizDock database with `pg_dump --clean --if-exists` into `database.sql`, and in the full setup the Keycloak database into `keycloak.sql`. The instance keeps running: the dump is consistent on its own.
2. Copies the media and the templates out of the application container (`media/`, `store/`).
3. Copies `.env` as `env`.
4. Prints the size of the backup.

The default folder is `./backups/quizdock-YYYYMMDD-HHMMSS/`, or under `QUIZDOCK_BACKUP_DIR` when it is set. Files are created readable by their owner only.

:::caution
The backup holds `.env`, with the database password and, in the full setup, Keycloak's passwords. It also holds personal data: accounts, nicknames, results. Store it where only operators can read it.
:::

Media uploaded while the backup runs may be missing from it. Take backups when no one is editing, for example at night.

## Schedule it

`./quizdock backup` does not schedule itself and keeps every backup. With cron, on the server, in the crontab of a user allowed to use Docker, for example every night at 03:00:

```txt
0 3 * * *  cd /srv/quizdock && ./quizdock backup >> backup.log 2>&1
```

Delete old backups yourself, and copy them off the server: a backup on the same disk does not survive the disk.

## Before an upgrade

`./quizdock upgrade` takes a backup first, by itself. See [Upgrade](/docs/operator/upgrade/).

## Without the script

The same backup by hand, in Compose, on the server, in the instance's folder (user and database as in `.env`):

```sh
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U quizdock --clean --if-exists quizdock > database.sql
docker compose -f docker-compose.prod.yml cp quizdock:/data/media ./media
docker compose -f docker-compose.prod.yml cp quizdock:/data/store ./store
cp .env env
```

The application image has no shell and no `tar`: `docker compose cp` copies the folders out of it.

## Next

[Restore an instance](/docs/operator/restore/).

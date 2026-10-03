---
title: Restore an instance
description: Restore a QuizDock backup with ./quizdock restore — what it replaces in each setup, what it leaves alone, and how to move an instance to another server.
sidebar:
  order: 11
---

This page puts a backup taken with `./quizdock backup` back in place, on the same server or on a new one.

:::danger
A restore **replaces** the current database, and in the full setup the Keycloak database, with the backup's. Everything changed since the backup is lost. Take a backup of the current state first if you might need it.
:::

## Restore a backup

1. On the server, in the instance's folder, make sure the instance is running (`./quizdock status`): the restore runs the database tools inside the containers.
2. Restore:

   ```sh
   ./quizdock restore ./backups/quizdock-20261003-030000
   ```

   The folder must contain `database.sql`, and in the full setup `keycloak.sql`. The script asks for confirmation.
3. Check the result:

   ```sh
   ./quizdock doctor
   ```

## What it does

**Compose and full:**

1. Stops the application container.
2. Loads `database.sql` into the QuizDock database. The dump starts by dropping the objects it recreates.
3. Full setup: stops Keycloak, loads `keycloak.sql`, starts Keycloak again.
4. Copies `media/` and `store/` into their volumes.
5. Starts the application.

**Standalone:** loads the database while the container runs, copies `media/` and `store/` into it, then restarts the container.

## What it leaves alone

- **`.env`.** The backup's `env` file is not put back. Compare it with the current `.env` and copy what you need. In particular, the database password in `.env` must stay the one the current database volume was created with.
- **Files added since the backup.** Media and templates are copied over the current folders; files the backup does not have stay where they are. The hourly media clean-up deletes the files no media points to.
- **The `branding/` folder**, which the backup does not hold.

Keep the database and the media from the **same** backup. A database older than the media folder is detected: the application then stops deleting stored files and says so in its log, but the media it cannot find are not shown until the two match.

## Move to another server

1. On the old server, in the instance's folder: `./quizdock backup ./move`.
2. Copy `./move`, the `quizdock` script and the Compose files (`docker-compose.prod.yml`, and for the full setup `docker-compose.full.yml` and `keycloak/`) to the new server's instance folder.
3. On the new server, in that folder, reuse the old configuration:

   ```sh
   cp ./move/env .env
   chmod 600 .env
   ./quizdock up
   ./quizdock restore ./move
   ./quizdock doctor
   ```

   Or run `./quizdock init` instead of copying `env`, and answer as before.
4. If the address changed, update `APP_PUBLIC_URL`, the identity provider's redirect addresses, and in the full setup `PUBLIC_HOST`.

Settings changed in the administration are in the database: they move with it.

---
title: Command line
description: The quizdock script on the server and the qd command in the container — every command, option and recipe, and the experimental MCP connector.
sidebar:
  order: 8
---

Two tools, one name:

| Tool | Where it runs | What it does |
|---|---|---|
| `./quizdock` script | On the server, in the instance's folder. Needs Docker with the Compose plugin, and curl | Install, start, stop, logs, backup, restore, upgrade; relays the administration commands |
| `qd` | Inside the application container | Doctor, host seat, accounts, sample quizzes, quiz export and import, retention purge, every administration operation |

You normally use only the script: it runs `qd` in the right container for you.

## The quizdock script

Get it once, on the server, in the instance's folder:

```sh
curl -fsSLO https://raw.githubusercontent.com/quizdock/quiz-dock/main/quizdock
chmod +x quizdock
```

It reads the setup (`QUIZDOCK_MODE`: `compose`, `full` or `standalone`) and everything else from `.env` in the current folder: run it from the instance's folder.

### Install and run

| Command | What it does |
|---|---|
| `init [--compose\|--full\|--standalone]` | Asks a few questions, writes `.env` (permissions `600`, random passwords), downloads the Compose files and the Keycloak realm when needed. Default: `--compose`. |
| `up` (or `start`) | Starts the containers, waits up to 120 s for `/health` (180 s more for Keycloak in the full setup). In standalone, creates the `quizdock` container on first use. |
| `down` (or `stop`) | Stops the instance. Compose: `docker compose down` (volumes kept). Standalone: stops the container. |
| `status` (or `ps`) | The containers, whether `/health` answers, the version running and the latest stable release. |
| `logs [service]` | Follows the last 200 lines of the log. Compose services: `quizdock`, `postgres`, `redis`, `migrate`, and `keycloak` in the full setup. |

### Maintenance

| Command | What it does |
|---|---|
| `backup [dir]` | Database dump, media, templates and `.env`, into `./backups/quizdock-YYYYMMDD-HHMMSS/` or `dir`. See [Back up an instance](/docs/operator/backup/). |
| `restore <dir>` | Replaces the database, media and templates with a backup, after confirmation. See [Restore an instance](/docs/operator/restore/). |
| `upgrade [tag]` | Backup, pull, restart with migrations, doctor. See [Upgrade](/docs/operator/upgrade/). |

### Administration, relayed to qd

| Command | What it does |
|---|---|
| `doctor` | Checks the configuration, PostgreSQL, migrations, Redis, the media folders and, in OIDC mode, the provider. See [Status and doctor](/docs/operator/status-and-doctor/). |
| `version` | The version running, and the latest stable release when `UPDATE_CHECK` is on. |
| `migrate:status` | Applied, pending and failed migrations. |
| `seat:status`, `seat:release` | Local mode: who holds the host seat; free it, whoever holds it. |
| `user:list` | Accounts, with subject, e-mail, role, operator grant and quiz count. |
| `user:set-role <sub\|email> <roles>` | Grants `host`, `admin` or `host,admin`; `player` withdraws the grant. |
| `samples:load <sub\|email>` | Adds the sample quizzes to that account's bank. |
| `quiz:list [<sub\|email>]` | Quizzes with id, title, owner, status, question count. |
| `quiz:export <id> <file.zip>` | Writes a quiz bundle to a file on the server, whoever owns the quiz. |
| `quiz:import <file> <sub\|email>` | Creates a draft in that account's bank from a bundle (zip or `quiz.json`) or a Kahoot `.xlsx` template on the server. |
| `quiz:validate <file>` | Checks a text-only `quiz.json` without writing anything. Exit code 0 when valid, 1 when not. |
| `quiz:transfer <quiz-id> <sub\|email>` | Hands a quiz over to another account, with the media only it uses and its archived games. Refused while it is being played. |
| `sessions:purge [--dry-run]` | Deletes the archived games past their retention date, with their results. |
| `mcp [--user=<sub\|email>]` | The experimental MCP connector. See the [annex](#annex-the-mcp-connector-experimental). |
| `qd <operation> [--param=value…]` | Any administration operation (below). |
| `admin <command…>` | Any other `qd` command, as is. |

Subjects are the OIDC `sub`, or `local:<slug>` in local mode (the name in lower case, without accents, other characters as dashes): `user:list` shows them.

### Script settings

Variables of the shell environment read by the script itself, not from `.env`:

| Variable | Default | What it changes |
|---|---|---|
| `QUIZDOCK_IMAGE` | `fchaussin/quizdock` | The standalone's image name |
| `QUIZDOCK_RAW` | the `main` branch on `raw.githubusercontent.com` | Where `init` downloads its files from |
| `QUIZDOCK_COMPOSE_FILE` | `docker-compose.prod.yml` | The Compose file |
| `QUIZDOCK_ENV_FILE` | `.env` | The environment file |
| `QUIZDOCK_CONTAINER` | `quizdock` | The standalone container's name |
| `QUIZDOCK_BACKUP_DIR` | `./backups` | Where `backup` writes |

From `.env`, the script reads only `QUIZDOCK_MODE`, `QUIZDOCK_TAG`, `HTTP_PORT`, `KEYCLOAK_PORT`, `POSTGRES_USER` and `POSTGRES_DB`.

## qd, inside the container

The script relays to `qd`. To call it directly, on the server:

```sh
docker compose -f docker-compose.prod.yml exec quizdock qd doctor   # Compose
docker exec quizdock qd doctor                                       # standalone
```

### Operations

Every command above is an operation of the administration, also reachable by its own name. `qd operations` lists them all, with their parameters. A few:

```sh
./quizdock qd operations
./quizdock qd settings.list --key=APP_NAME          # value, source, default, problems
./quizdock qd settings.set --key=GAME_READ_DELAY_MS --value=4000
./quizdock qd settings.reset --key=GAME_READ_DELAY_MS   # back to .env; --all for every one
./quizdock qd settings.export                       # the overrides as JSON: .env lines in "env"
./quizdock qd audit.list --limit=20                 # the last administrative actions
./quizdock qd audit.list --setting=APP_NAME         # the history of one setting
./quizdock qd presets.list                          # the quick setup's questions and answers
./quizdock qd presets.apply --internet=offline --dry-run
./quizdock qd setup.token                           # a new setup token for the wizard
./quizdock qd setup.complete                        # skip the wizard
./quizdock qd setup.reopen                          # open the wizard again
```

The quick setup's questions and answers: `--internet=connected|offline`, `--audience=colleagues|class|public`, `--accessibility=standard|adapted`.

| Option | Effect |
|---|---|
| `--yes` | Confirms a destructive operation, a change of administrator rights, a change to a C2 setting, `settings.reset --all`, and `presets.apply` when it changes a C2 setting. Without it, `qd` asks on a terminal and refuses elsewhere. The commands of the tables above never ask. |
| `--dry-run` | Says what the operation would do, for those that can (`sessions.purge`, `presets.apply`). |
| `--json` | The outcome as JSON, for scripts. |
| `--as=<name>` | The name the audit records (default: the container's user). |

Exit codes: `0` done, `1` partly done or refused, `2` wrong usage.

`qd` is not limited by `ADMIN_WEB_SCOPE` or `ADMIN_LOCK`: whoever can run commands in the container administers the instance. It never changes a C1 variable. Every change and every refusal is recorded in the audit, with **CLI** as the channel.

## Recipes

All of them run on the server, in the instance's folder.

### Enforce the retention of archived games

Archived games are kept 365 days, then wait for a purge: nothing deletes them by itself. Run the purge from cron, for example every Monday at 04:00 (in the crontab of a user allowed to use Docker):

```txt
0 4 * * 1  cd /srv/quizdock && ./quizdock sessions:purge >> purge.log 2>&1
```

Preview first with `./quizdock sessions:purge --dry-run`. See [Privacy and retention](/docs/admin/privacy-and-retention/).

### Someone left with the host seat (local mode)

```sh
./quizdock seat:status
./quizdock seat:release
```

### Make someone a host or an administrator

```sh
./quizdock user:list
./quizdock user:set-role alice@example.org host,admin
```

The account must have signed in once. A grant outranks the seat and the provider's claims, and is never lowered by them.

### Move a quiz to another instance

```sh
./quizdock quiz:list alice@example.org            # find the id
./quizdock quiz:export 01J… ./capitals.quizdock.zip
# on the other instance:
./quizdock quiz:import ./capitals.quizdock.zip bob@example.org
```

### Hand a quiz over to a colleague

```sh
./quizdock quiz:transfer 01J… bob@example.org
```

### Upgrade

```sh
./quizdock upgrade 0.13.0
```

## Annex: the MCP connector (experimental)

:::caution[Experimental]
The tools are covered by QuizDock's tests, but the connector has not been tried end to end with every chatbot client. Its commands and answers may change.
:::

QuizDock ships a local **stdio** MCP server, for chatbot clients that can start a process (a desktop client, for example). It helps convert a quiz from another format: the model reads the format guide, writes a `quiz.json`, validates it, and imports it as a draft. It opens no HTTP listener and makes no outgoing request; it works on an offline instance through your existing Docker or SSH access.

### Tools

| Tool | Effect |
|---|---|
| `quiz_format` | The current format guide, generated from the importer's schemas. |
| `validate_quiz` | Checks a complete `quiz.json`, given as a string: up to 100 errors and 100 completeness warnings. Writes nothing. |
| `import_quiz` | Creates a new draft in the configured host's bank. Only with `--user`. Never overwrites a quiz. |

Input is text only: no images, sounds, archives or media URLs. Add the media in the editor afterwards, and check the correct answers before playing.

### Configure a client

The account must exist and have the `host` role (`admin` alone is not enough). Example client configuration, with the standalone container:

```json
{
  "mcpServers": {
    "quizdock": {
      "command": "docker",
      "args": ["exec", "-i", "quizdock", "qd", "mcp", "--user=local:alex"]
    }
  }
}
```

- From the instance's folder, `./quizdock mcp --user=local:alex` does the same for any setup.
- On another machine, over SSH: `ssh -T operator@quiz-host docker exec -i quizdock qd mcp --user=local:alex`.
- Never allocate a terminal (no `-t`): the connection carries JSON only.
- Without `--user`, only the format and validation tools exist.

### Access and limits

- Access is your existing access to the container or the server: there is no new token. The model cannot choose another owner. The host role is checked again before every import.
- To disconnect, stop the process or remove the client's configuration. Give a client Docker or SSH access only if you trust it with those rights.
- What the model reads (the quiz source and the tools' answers) goes to the chatbot's provider: choose one fit for that content.
- A `quiz.json` is limited to 1 MiB (or `IMPORT_MAX_BYTES`, if smaller). Each process accepts at most 60 tool calls and 10 imports a minute, one import at a time.
- Clients that only accept a remote HTTP MCP endpoint are not supported.

The same validation without a chatbot:

```sh
./quizdock quiz:validate quiz.json
```

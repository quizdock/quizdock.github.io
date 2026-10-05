---
title: Administration overview
description: What an administrator of a QuizDock instance does, what the web administration may change, the qd equivalents, and the setup wizard of a new instance.
sidebar:
  order: 1
---

This part of the Documentation is for people with the **admin** role: they administer a QuizDock instance from the web administration, or with the `qd` command line. Installing the server, its `.env` file and its restarts belong to whoever runs the instance: see the [operator documentation](/docs/operator/choose-a-deployment/). Quiz hosts, the people who present quizzes to a room, have [their own pages](/docs/host/getting-started/).

## Three domains

The administration covers three domains.

| Domain | What it holds |
|---|---|
| **Instance** | Settings, accounts and roles, the host seat (local mode), health, the audit, the statistics. |
| **Quizzes** | Every quiz and its sessions, whoever owns them: hand one over, export, import for an account, archive, restore, delete, find the ones nobody can reach, purge old sessions. |
| **Media** | Every file on the instance's media volume, the global media offered to every host, the clean-up. |

## Who may do what

Only an account with the **admin** role opens the administration. The role comes from the identity provider (OIDC mode), from the setup wizard (the first administrator in local mode), or from a grant: see [Accounts and roles](/docs/admin/accounts-and-roles/).

An administrator reads everything in the three domains. Changing something depends on the domain and on four variables of the instance's `.env` file. These four are never changed from the web, and a change to them applies when the instance restarts.

| Variable | Effect on the web administration |
|---|---|
| `ADMIN_WEB_SCOPE` | `read` (the default): the Instance domain is shown and nothing in it can be changed. `write`: administrators may change settings of levels C2 to C4, roles and the host seat. Quizzes and media are not concerned. |
| `ADMIN_LOCK` | A comma-separated list of variables the web never changes, whatever the scope (for example `APP_NAME,MEDIA_MAX_VIDEO_MB`). |
| `ADMIN_TOKEN` | Local mode only (`AUTH_MODE=none`). Local mode has no accounts: whoever types an administrator's name signs in as them. So the web changes nothing in the Instance and Quizzes domains until this token is set (32 characters or more) and given in the page. The Media domain does not need it. |
| `ADMIN_OVERRIDES` | `ignore` starts the instance on `.env` alone: every value changed from the administration is kept but not applied. See [Settings](/docs/admin/settings/#safe-mode). |

In short:

| Domain | Read | Change from the web |
|---|---|---|
| Instance | Any administrator | `ADMIN_WEB_SCOPE=write`, and the token in local mode. Never a level C1 setting, never a variable in `ADMIN_LOCK`. |
| Quizzes | Any administrator | Any administrator, and the token in local mode. |
| Media | Any administrator | Any administrator. |

## Allow changes from the web

A new instance's administration is **read-only** in the Instance domain: `ADMIN_WEB_SCOPE` is `read` by default, and the settings page says "The web shows every setting and changes none". This is on purpose. Nothing changes the instance from a browser until whoever runs the server decides who administers it, so a shared or forgotten administrator session cannot change it first. The setup wizard of a new instance is not concerned: it sets its answers whatever the scope.

`./quizdock init` asks it: "Let administrators change settings from the browser? (y/N)". Answered yes, it writes `ADMIN_WEB_SCOPE=write` and, in local mode, a generated `ADMIN_TOKEN` in `.env`, and says where to find it.

For an instance already installed, or set up by hand, on the server, in the instance's folder:

1. In `.env`, set `ADMIN_WEB_SCOPE=write`.
2. Local mode only (`AUTH_MODE=none`): also set `ADMIN_TOKEN`, 32 characters or more, and give it to the administrators. For example: `openssl rand -hex 32`.
3. Apply the new values:
   - Compose: `./quizdock up` (the application is recreated with them).
   - Standalone: `docker rm -f quizdock`, then `./quizdock up`. The data stays in the `quizdock` volume; a plain `./quizdock up` would restart the old container with the old values.
4. Reload the administration. The settings page now says "The web may change the settings of levels C2 to C4 (ADMIN_WEB_SCOPE=write); C1 never." In local mode, it asks for the token once per tab.

Level C1 settings and the variables listed in `ADMIN_LOCK` stay `.env` only, whatever the scope. To go back, set `ADMIN_WEB_SCOPE=read` and apply it the same way. The values already changed from the web stay applied, and a read-only administration can no longer take them back: use **Back to .env** or **Take everything back** before ([Settings](/docs/admin/settings/)), or, on the server, `./quizdock qd settings.reset --all`.

In local mode, the page asks for the token: "Local mode: enter the administration token (ADMIN_TOKEN) to change anything. It is kept in this tab only." When no token is set in `.env`, it says so instead. Ten wrong tokens from one address, or fifty from all addresses together, make the administration wait a quarter of an hour.

An operation that destroys something (deleting a quiz or a file, purging sessions) asks for a confirmation, valid five minutes. So does a change to a level C2 setting, and a role change that keeps or grants the administrator role, or withdraws every role. Some operations first show what they would do (**Preview**).

## The sections

**Administration** in the top bar opens on the statistics. Its tabs follow the domains, in this order:

- [Statistics](/docs/admin/statistics/): what is played right now, the instance at a glance, the last twelve months.
- [Quizzes](/docs/admin/quizzes/): every quiz of the instance.
- [Media](/docs/admin/media/): the instance's media.
- [Accounts](/docs/admin/accounts-and-roles/), [Settings](/docs/admin/settings/), [Health](/docs/admin/health/), [Audit](/docs/admin/audit/): the instance.

## The update notice

When a newer stable release of QuizDock is out, a notice appears above every page of the administration: "QuizDock X is available." It gives the version running, the new release's date, **What's new** and **Before upgrading** (from the release notes), and the command to run on the server, in the instance's folder:

```sh
./quizdock upgrade <version>
```

The web installs nothing: the upgrade is the operator's job ([Upgrade](/docs/operator/upgrade/)). **Hide until the next version** hides the notice in this browser only.

The notice depends on `UPDATE_CHECK`, on by default. The server then asks GitHub (`api.github.com`) for the latest release at most once a day, and again an hour later when GitHub did not answer. GitHub sees the server's IP address; nothing else is sent. The "No" answer to the Internet question of the [quick setup](/docs/admin/presets/) turns the check off. The same check shows on the [Health](/docs/admin/health/#version) page.

## The command line

Every operation of the web administration is also a `qd` operation, run in the container. The media library's lists are the exception: they are read from the web only. The command line is never limited by `ADMIN_WEB_SCOPE`, `ADMIN_LOCK` or `ADMIN_TOKEN`: a shell in the container already holds every right. Every change made this way is kept in the [audit](/docs/admin/audit/) too, marked "Command line".

On the server, in the instance's folder:

```sh
./quizdock qd operations                       # every operation and its parameters
./quizdock qd settings.list --key=APP_NAME     # one setting: value, source, problems
./quizdock qd audit.list --limit=20            # the last administrative actions
```

| Option | Effect |
|---|---|
| `--yes` | Confirms a destructive operation, a change of administrator rights, a change to a C2 setting, `settings.reset --all`, and `presets.apply` when it changes a C2 setting. Without it, `qd` asks on a terminal and refuses elsewhere. |
| `--dry-run` | Says what the operation would do, for those that can (`sessions.purge`, `presets.apply`). |
| `--json` | The outcome as JSON, for scripts. |
| `--as=<name>` | The name the audit records. |

The full list of commands is in [Command line](/docs/operator/cli/).

## The setup of a new instance

A new instance, with no account yet, offers a **setup wizard** in the browser. The home page says "This instance is not fully set up yet." with a **Set it up** link (`/setup`).

What the container needs before it starts (database, Redis, `AUTH_MODE`, ports, volumes) is set before, by `./quizdock init` or in `.env`. The wizard shows these values; it does not change them.

### The setup token

Whoever reaches a new instance must not become its owner. So the wizard asks for a **setup token**:

- The instance writes it in its logs when it starts: "This instance is not set up yet. Open it in a browser and give the setup token …".
- It works only once and expires 24 hours after it was created.
- Each start, while the setup is open, writes a new one; the previous one stops working.
- `qd setup.token` gives a new one while the setup is open; the previous one stops working. Once it is completed, `qd setup.reopen` opens it again.

To get a fresh token, on the server, in the instance's folder:

```sh
./quizdock qd setup.token
```

A wrong token is recorded in the [audit](/docs/admin/audit/). After a hundred wrong tokens in a quarter of an hour, from all addresses together, the wizard waits; a new token lifts the wait.

Once given, the token opens a wizard session of two hours. In OIDC mode, the wizard also needs a signed-in account, and finishing it needs the admin role (from the identity provider, or granted with `qd user:set-role`).

### The steps

1. **Usage**: three questions about how the instance will be used. Each answer sets several settings at once, shown before they are applied. See [Quick setup](/docs/admin/presets/).
2. **Health**: the database, Redis, the migrations, the folders, the critical variables. What fails here is fixed in `.env`, then the instance restarted; the wizard goes on once the check passes.
3. **Identity**: the name, the language, the logo, where the feedback links lead. See [Branding](/docs/admin/branding/).
4. **Address**: the addresses offered to participants (QR code, join link), and a [test from a phone](/docs/admin/health/#phone-test).
5. **Access**: the authentication mode, as set in `.env`. In OIDC mode, whether hosts may open a game to participants without an account. In local mode, the name of the first administrator.
6. **Limits & pace**: media sizes and game timings. The defaults suit most instances.
7. **Content**: the sample quizzes, added to the bank of an account.
8. **Summary**: what is set and where it comes from, with a `.env` excerpt to pin it.
9. **Finish the setup** closes the wizard for good.

The wizard sets settings of levels C2 to C4 whatever `ADMIN_WEB_SCOPE` says, since it runs once, under its token. It never changes a variable named in `ADMIN_LOCK`, nor a level C1 setting. Every change is recorded in the audit.

In local mode, the first administrator signs in with the name given at the **Access** step. After the setup, changes from the web also need `ADMIN_TOKEN`.

### Skip, reopen

- An automated deployment skips the wizard with `qd setup.complete`.
- An instance that already had accounts when it was upgraded to a version with the wizard is considered set up.
- Once finished, the wizard is closed for good. `qd setup.reopen` opens it again, from a shell only, with a new token.

```sh
./quizdock qd setup.complete
```

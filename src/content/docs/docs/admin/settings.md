---
title: Settings
description: "How the settings page of the QuizDock administration works: what a row shows, which variables the web may change, when a change applies, and how to go back to .env."
sidebar:
  order: 6
---

**Administration → Settings** shows every variable QuizDock reads, and lets an administrator change some of them without touching the server. This page explains what each row says and how a change behaves. The meaning of each variable is in [Configuration](/docs/operator/configuration/).

## What a row shows

| Column | What it says |
|---|---|
| **Variable** | Its name, and a label in plain words. |
| **Value** | The value in use, in MB and seconds whatever unit the variable is written in. A secret shows only "Set" or "Not set". |
| **Source** | "Default", "From .env", or "Changed here" (from the administration). A value changed here also shows the `.env` value it replaces. |
| **Level** | C1 to C4 (below). |
| **Applies** | When a change takes effect (below). |

A row also says why it cannot be changed here, and the problems found when the instance started:

- "Cannot be read (accepts …): the default is used."
- "Outside what it accepts (…): used as is for now; a later release will enforce it."
- "Settings that contradict each other:" lists the rules two variables break together.

Each setting has its help: what it does, what it accepts, its default, how it is written in `.env`, the variables that go with it, a link to the Documentation, and its **Last changes** (from the [audit](/docs/admin/audit/)).

**Layout** offers the same rows as **Cards**, **List and detail** or **Table**. **Search a setting** and **Show only** ("Changed from the default", "Changed here", "With a problem", "Editable") narrow them down.

Below, **Outside the application** lists the variables read by Docker Compose, the `quizdock` script, the image build or Keycloak, never by the application. They are changed where they are read, never here.

## Levels

| Level | Meaning | From the web |
|---|---|---|
| **C1** | "Critical: start-up, data or security." Database, Redis, `AUTH_MODE`, the OIDC client, ports, folders, the `ADMIN_*` variables. | Never. Set in `.env`, then the instance restarted. |
| **C2** | "High: who may enter, how much may be stored." Open access, the community catalogues, the media and import limits. | With `ADMIN_WEB_SCOPE=write`. Each change confirmed. |
| **C3** | "Normal: how the instance behaves." Invitation addresses, game timings. | With `ADMIN_WEB_SCOPE=write`. |
| **C4** | "Cosmetic: look and wording." Name, language, logo, feedback links, transitions, the update check. | With `ADMIN_WEB_SCOPE=write`. |

A few other variables are internal and also stay in `.env`. A variable named in `ADMIN_LOCK` is never changed from the web either, whatever its level. In local mode, a change also needs the [administration token](/docs/admin/overview/#who-may-do-what).

The settings an administrator may change from the web:

| Level | Settings |
|---|---|
| C2 | `ALLOW_ANONYMOUS_PARTICIPANTS`, `QUIZ_STORE_URL`, `QUIZ_STORE_HOSTS`, `MEDIA_MAX_BYTES`, `MEDIA_MAX_VIDEO_MB`, `MEDIA_MAX_AUDIO_MB`, `IMPORT_MAX_BYTES` |
| C3 | `OIDC_NAME_CLAIM`, `APP_PUBLIC_URL`, `HOST_LAN_IPS`, `PUBLICATION_MAX_MB`, `GAME_READ_DELAY_MS`, `GAME_ALL_ANSWERED_DELAY_MS`, `GAME_AUTO_ADVANCE_MS`, `GAME_MEDIA_WAIT_S` |
| C4 | `APP_NAME`, `APP_LANG`, `APP_LOGO_URL`, `APP_FEEDBACK_URL`, `UPDATE_CHECK`, `MEDIA_LIBRARY_LINKS`, `LIVE_MOTION` |

## When a change applies

| Applies | Meaning |
|---|---|
| **Live** | "On its next use: a game in progress follows it." |
| **Next room** | "In the rooms opened after the change; a room in progress keeps its own." |
| **At restart** | "Read once at start: the instance must restart." |

Every setting the web may change applies live, except `LIVE_MOTION`, which applies to the next room. The settings that apply at restart are the ones set in `.env` only.

## Change a setting

1. Find the setting. Its row has a control where the web may change it: a switch, a list, a number in its unit with its range, or an editable list.
2. Type the value. It is checked as it is typed, against what the setting accepts and against the other settings.
3. **Save**. A level C2 change asks for a confirmation.

The page then says when it applies: "Saved: it applies now.", "Saved: it applies to the rooms opened from now on." The change is recorded in the [audit](/docs/admin/audit/), with the value it replaced.

A value changed here is checked more strictly than a value in `.env`: it must be within the setting's range, where an `.env` value out of range is only reported.

## Which value wins

```text
default  <  .env  <  administration
```

A value changed here wins over `.env`. The values changed here are kept in the database, so they are backed up with it, and they survive a change to `.env`.

| Button | What it does |
|---|---|
| **Back to .env** | On a row changed here: takes the change back. The `.env` value, or the default, applies again. |
| **Export as .env** | Gives every change made here as a `.env` excerpt: "To pin them in .env (then take them back here), or to move them to another instance". |
| **Take everything back** | Removes every change made here, after a confirmation. |

In the exported excerpt, a value with a space, `#`, `$`, a quote or a backslash comes in quotes, the way Docker Compose reads it literally. The standalone container, started with `docker run --env-file`, takes values without quotes: remove them there.

From the command line, on the server, in the instance's folder:

```sh
./quizdock qd settings.list --key=GAME_READ_DELAY_MS
./quizdock qd settings.set --key=GAME_READ_DELAY_MS --value=4000
./quizdock qd settings.reset --key=GAME_READ_DELAY_MS      # back to .env
./quizdock qd settings.reset --all --yes                   # take everything back
./quizdock qd settings.export                              # the .env excerpt
```

The command line is not limited by `ADMIN_WEB_SCOPE` nor `ADMIN_LOCK`, but it follows the same levels: a C1 setting is changed in `.env` only.

## Safe mode

When a value changed here went wrong, the operator can start the instance on `.env` alone. In `.env`, on the server:

```sh
ADMIN_OVERRIDES=ignore
```

then restart the instance. The page then says "Safe mode (ADMIN_OVERRIDES=ignore): the values changed here are kept but not applied." and every row is read-only. Fix or take back the faulty value from a shell (`qd settings.reset`), then remove the line from `.env` and restart.

## Questions

### Why is every setting read-only?

The page says why at the top. Most often: "The web shows every setting and changes none (ADMIN_WEB_SCOPE=read)." That is the default. The operator sets `ADMIN_WEB_SCOPE=write` in `.env` and restarts the instance. See [Troubleshooting](/docs/admin/troubleshooting/) for the other reasons.

### I changed a value in `.env` and nothing changed.

`.env` is read when the instance starts: a change there applies after a restart. If the row's **Source** still says "Changed here" after the restart, the value from the administration wins: **Back to .env** lets the `.env` value apply.

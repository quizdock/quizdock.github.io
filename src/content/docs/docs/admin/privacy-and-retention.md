---
title: Privacy and retention
description: What a QuizDock instance stores about hosts and participants, the choices a host makes at launch, how long data is kept, how to purge it, and what QuizDock cannot delete yet.
sidebar:
  order: 11
---

This page lists what a QuizDock instance keeps, for how long, and what an administrator can delete. It describes the software; it is not legal advice.

The organisation that runs the instance is the data controller for what it holds. QuizDock's maintainers receive none of it: QuizDock sends no telemetry. The app has no privacy-policy page of its own: inform hosts and participants by your own means.

## What is stored

In the database:

| What | Holds |
|---|---|
| **Accounts** | In OIDC mode: the provider's subject, the display name, the e-mail when the provider gives one, the roles, the language and preferences. In local mode: the name typed (`local:<name>`). An account is created when someone signs in. |
| **Archived sessions** | For each archived game: its host, PIN and room, the number of players, the success rate, and a copy of the quiz as it was played. |
| **Results** | With personalised tracking on: each participant's nickname, score, rank, number of right answers, average time and streak, linked to their account when they have one. |
| **Answers** | With full capture on only: every answer of every participant. |
| **Feedback** | What participants leave on a quiz: their nickname, a rating from 1 to 5, an optional comment. |
| **Audit** | Every administrative action and refusal: the name and account of who did it, their IP address, the parameters (secrets masked). |

In Redis, for a short time:

| What | Kept |
|---|---|
| A game's live state | 4 hours |
| An OIDC session | Forgotten after 24 hours unused |
| A sign-in in progress | 10 minutes |
| Wrong PINs from one address | 60 seconds |

On disk: the media files hosts upload, and the shared templates.

In the browser: in OIDC mode, two cookies for the session (`qd_session`, `qd_login`), unreadable by scripts. The browser's local storage keeps interface preferences, the participant's nickname and avatar, a device id, a reconnection token, and which quizzes were already rated. There are no tracking cookies.

## What the host chooses at launch

The host makes these choices in the lobby, before the quiz starts:

| Choice | Default | Effect |
|---|---|---|
| **Personalised tracking** | On | On: results are recorded under each participant (archived leaderboard, history). Off: no individual result is kept, only the group's overall results. Unavailable in open access. |
| **Record all answers** (full capture) | Off | Keeps every answer of every participant, for individual tracking (assessment, certification). Needs personalised tracking. Cannot be changed once the quiz has started. |

Turning full capture on shows a warning: "Every answer of every participant will be kept, with their nickname: that is personal data (GDPR — inform the participants, purge afterwards)."

At the end, **Archive this quiz's results** is ticked by default: the leaderboard and statistics stay in the quiz's history. Unticked, the game leaves no archive. A quiz stopped early can be kept with **Keep what was played so far**.

In OIDC mode with open access allowed, the host also chooses how participants join: with their account, or with a PIN and a nickname alone (no personal tracking). See [Accounts and roles](/docs/admin/accounts-and-roles/#open-access-oidc-mode).

### What participants are told

The participant's page shows one notice matching these choices:

- "Your taking part and your score are recorded under your account."
- "Your taking part and your score are recorded under your account — and every one of your answers is kept."
- "Your individual results are not recorded — only the group's overall results are."
- "Your taking part and your score are recorded with each quiz's results, under your nickname."
- "Your taking part and your score are recorded with each quiz's results, under your nickname — and every one of your answers is kept."

The last two are for participants without an account. In OIDC mode, the host may let participants pick their display name; the app reminds that "a chosen name is not anonymity": results stay attached to the account.

## How long data is kept

| Data | Kept until |
|---|---|
| Archived sessions, their results and answers | 365 days after the game, then deleted when an administrator purges them (below). |
| Statistics history | Read from the archived sessions: it shrinks when they are purged. |
| Media nothing uses | Deleted automatically after a day ([Media](/docs/admin/media/#clean-up)). |
| Quizzes, their media and feedback | Until the quiz is deleted. |
| Accounts | Kept: there is no account deletion yet. |
| Audit | Never deleted. |

The 365 days are fixed: no setting changes them.

### Archived sessions

Nothing deletes an archived session on its own when it passes its 365 days. An administrator purges them:

- from the web: **Administration → Quizzes → Purge old sessions**, with **Preview** to see what it would delete;
- from the command line, on the server, in the instance's folder:

```sh
./quizdock sessions:purge --dry-run     # what it would delete
./quizdock sessions:purge
```

To enforce the retention, schedule the purge, for example once a week from the server's crontab:

```text
0 4 * * 1  cd /srv/quizdock && ./quizdock sessions:purge >> purge.log 2>&1
```

See [Command line](/docs/operator/cli/).

An archived session cannot be deleted on its own before that: it goes when its quiz is deleted ([Quizzes](/docs/admin/quizzes/#delete-a-quiz)).

## What QuizDock cannot delete yet

- **An account.** There is no account deletion or anonymisation, from the web or the command line.
- **One archived session**, apart from deleting its quiz or purging it after 365 days.
- **Feedback**, apart from deleting its quiz.
- **The audit**, by design.

## What leaves the server

A QuizDock server makes these requests, and no other:

1. **The update check** (`UPDATE_CHECK`, on by default): GitHub, at most once a day. GitHub sees the server's IP address; nothing else is sent. See [Health](/docs/admin/health/#version).
2. **The community catalogues** (`QUIZ_STORE_URL`, empty by default): the catalogues listed there, and the download hosts `QUIZ_STORE_HOSTS` adds. The services see the server's IP address; no identity, content or results are sent.
3. **The identity provider**, in OIDC mode, which may be on your own network.

The browser may also load an image a quiz's text links to on the web, and a logo set by `APP_LOGO_URL`. The feedback links and the media library links are plain links the user follows.

With the "No" answer to the Internet question of the [quick setup](/docs/admin/presets/), local mode or an identity provider on your network, and no image from the web in the quizzes, the server makes no outgoing request. See [Privacy](/privacy/) and [Air-gapped](/docs/operator/air-gapped/).

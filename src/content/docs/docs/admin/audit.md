---
title: Audit
description: "The audit of a QuizDock instance: every administrative change and every refusal, from the web or the command line, kept for good and never edited."
sidebar:
  order: 10
---

The audit answers "who changed what, when, and how did it end?". **Administration → Audit** lists every administrative action, newest first, from the web and from the command line. Any administrator can read it.

## What is recorded

- Every change: a setting, a role, the host seat, a quiz handed over, archived, restored, imported or deleted, a media added, withdrawn or deleted, the clean-up run, sessions purged, the quick setup, every change made in the setup wizard.
- Every refusal of an operation: an account without the admin role turned away, a change refused by `ADMIN_WEB_SCOPE`, `ADMIN_LOCK` or the level of a setting, a wrong or missing administration token, invalid parameters, an expired confirmation, a wrong setup token.

Reading something (a list, a preview) is not recorded, unless it is refused. A request turned away before the operation runs is not recorded either: too many calls or wrong tokens (`429`), a missing or expired setup session.

## What a row holds

| Column | What it says |
|---|---|
| **When** | How long ago; the exact date and time on hover. |
| **Who** | The account's name, through "Web" or "Command line", and the address it came from. Behind a proxy, the address the proxy gives comes first, then the connection's own: `203.0.113.5 via 172.18.0.1`. |
| **Operation** | The operation's name and its id (for example `settings.set`). |
| **Parameters** | What the operation was given. Secrets are masked (`***`), a secret setting's value included. **What it replaced** unfolds the values before the change: for a setting, the override it replaced, `null` when the value came from `.env`. |
| **Outcome** | "Done", "Nothing to do", "Partly", "Refused" or "Failed", with the reason of a refusal (for example "Read only: ADMIN_WEB_SCOPE=read."). |

The record also keeps how long the operation took.

A change that takes longer than its time is answered "Took too long." but goes on. Its real outcome joins the audit when it ends, marked `late`: check the audit before running it again.

**Operation** filters the list by one operation; **Newer** and **Older** move by 50 rows.

## Kept for good

Nothing in QuizDock edits or deletes an audit row. The audit is in the database, so it is backed up and restored with it. It is never purged.

The audit holds names and addresses: see [Privacy and retention](/docs/admin/privacy-and-retention/).

## From the command line

On the server, in the instance's folder:

```sh
./quizdock qd audit.list                               # the last 50 rows
./quizdock qd audit.list --limit=200
./quizdock qd audit.list --operation=quizzes.delete
./quizdock qd audit.list --setting=APP_NAME            # one setting's history
```

`--setting=KEY` gathers every change to a setting: one at a time from [Settings](/docs/admin/settings/), together with others by the [quick setup](/docs/admin/presets/), or all at once by **Take everything back**. It is the **Last changes** shown in each setting's help.

`--json` gives the rows as JSON, for a script. A command records the name of the container's user, or the one given with `--as=<name>`.

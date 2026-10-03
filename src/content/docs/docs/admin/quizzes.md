---
title: Quizzes of the instance
description: Find any quiz of a QuizDock instance, whoever owns it; open, export, hand over, archive, restore or delete it; import a quiz for an account; add the sample quizzes; purge old sessions.
sidebar:
  order: 3
---

**Administration → Quizzes** lists every quiz of the instance, whoever owns it. An administrator uses it to look after the quizzes of people who left, to move a quiz to a colleague, and to keep the database tidy.

These operations need the admin role. `ADMIN_WEB_SCOPE` does not concern them; in local mode, changes need the [administration token](/docs/admin/overview/#who-may-do-what).

## Find a quiz

The list shows 25 quizzes a page, the most recently updated first, with their owner and number of questions.

- **Search a quiz** looks in the titles.
- **Owner** keeps one account's quizzes; **Status** keeps drafts, ready or archived quizzes.
- **Nobody can reach them** keeps the quizzes whose owner no longer has the host role. Each is marked "Owner can no longer reach it".
- A quiz being played says so: "Being played (PIN 123456)".

## What each quiz offers

Each row has its actions menu.

| Action | What it does |
|---|---|
| **Open** | Opens the quiz. Someone else's quiz is read-only: "Alice's quiz: you can read it, not change it." |
| **Export** | Downloads the quiz as a bundle (a zip: `quiz.json` and its media), to keep it or import it elsewhere. |
| **Hand over** | Gives the quiz to another account (below). |
| **Archive** | Takes the quiz out of its owner's list. It is kept with its history. |
| **Restore** | Brings an archived quiz back to its owner, as a draft. |
| **Delete** | Deletes the quiz, the media nothing else uses, and its archived sessions. |

**Hand over** and **Delete** are not available while the quiz is being played: wait for the room to close.

### Hand a quiz over

For an account that left, or a colleague who takes over.

1. In the quiz's actions, choose **Hand over**.
2. Search the new owner by name, subject or e-mail. The account must have signed in at least once; give it the host role so they can work on the quiz.
3. Confirm.

The media only this quiz uses follow it. A media the previous owner also uses in another quiz stays with them. The quiz's archived sessions follow too, so the new owner can read their results.

This is not how hosts share their work with each other: they share copies, through templates.

From the command line, on the server, in the instance's folder:

```sh
./quizdock quiz:list
./quizdock quiz:transfer <quiz-id> ada@example.org
```

### Delete a quiz

The confirmation names the quiz and its owner: "Delete "Capitals" of Alice (local:alice), its media nothing else uses and its archived sessions. Export it first: this cannot be undone."

Export it first if anyone may need it again. Deleting a quiz also removes the feedback participants left on it.

## Above the list

| Button | What it does |
|---|---|
| **Import a quiz for an account** | Creates a draft in an account's bank from a bundle: a zip, a `quiz.json`, or a Kahoot spreadsheet. The file is limited by `IMPORT_MAX_BYTES` (50 MB by default). |
| **Add the sample quizzes** | Adds the sample quizzes to an account's bank, ready to present. |
| **Purge old sessions** | Deletes the archived sessions past their retention date, with their results. **Preview** first says what it would delete. |

An account is given by its subject (`local:<name>` in local mode) or its e-mail.

Archived sessions are kept 365 days. Nothing deletes them on its own: see [Privacy and retention](/docs/admin/privacy-and-retention/#archived-sessions).

From the command line:

```sh
./quizdock quiz:import quiz.zip ada@example.org     # a file on the server
./quizdock quiz:export <quiz-id> quiz.zip
./quizdock samples:load local:alice
./quizdock sessions:purge --dry-run                 # what it would delete
```

## Questions

### A host lost their quizzes. Where are they?

Search the owner in **Administration → Quizzes**. An archived quiz is filtered out of the host's own list: **Restore** brings it back as a draft. If the host lost the host role, the quizzes are under **Nobody can reach them**: give the role back ([Accounts and roles](/docs/admin/accounts-and-roles/)) or hand the quizzes over.

### Can I edit someone else's quiz?

No. An administrator reads it; only its owner edits it. Hand it over to the person who will edit it, or export it and import a copy into their bank.

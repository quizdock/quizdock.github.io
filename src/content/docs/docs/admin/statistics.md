---
title: Statistics
description: "The statistics of a QuizDock instance: what is played right now, what the instance holds, and how it was used over the last twelve months."
sidebar:
  order: 5
---

**Statistics** is the first page of the administration. It answers three questions: what is played right now, what the instance holds, and how it was used over the last twelve months. Any administrator can read it.

## Live

The **Live** part is read again every five seconds ("Updated at …"). When it cannot be read again, it keeps the last figures and says how old they are.

- **Games under way**: how many, in the lobby or being played.
- **Players connected**: across every game.
- For each game: the quiz, its host, where it is ("Lobby" or "Question 3 of 10"), its players, when it was opened, and its PIN.

"No game is being played right now." when the instance is idle.

From the command line, on the server, in the instance's folder: `./quizdock qd stats.live`.

## The instance

The instance at a glance:

| Figure | Details |
|---|---|
| **Accounts** | How many, with the hosts and the administrators among them. |
| **Quizzes ready to play** | With the drafts and the archived quizzes. |
| **Media** | The files and their total size, each file counted once however many quizzes share it. |
| **Games played** | The games kept in the history, and when the last one ended. |

## Over the last 12 months

Read from the games' history:

- games, players and success rate, by month;
- the **Most played quizzes** and the **Most active hosts**;
- **Players with an account**: among the players of games with personalised tracking, the share who took part with an account, against guests.

From the command line: `./quizdock qd stats.history`.

The history holds what is kept, under two conditions:

- **Only archived games count.** A host chooses at the end of a room whether to archive its results ("Archive this quiz's results", ticked by default). A game not archived leaves no history.
- **Purged games no longer count.** Archived sessions are kept 365 days, then deleted when an administrator purges them. The page says where its history starts: "The history starts on …: older games are purged." See [Privacy and retention](/docs/admin/privacy-and-retention/#archived-sessions).

Months are counted in UTC.

## Questions

### Why does a game I just played not appear in the history?

It appears once it has ended and been archived. A game whose host unticked "Archive this quiz's results" is not kept. While it is played, it shows under **Live**.

### Do the statistics show individual results?

No. This page shows totals. A game's own results (its leaderboard, and each participant's answers when full capture was on) are in its quiz's history: see [Reports and history](/docs/host/reports-and-history/).

---
title: Reports and history
description: Find the results of past QuizDock sessions per quiz, read the results by question and by player, and what tracking and full capture keep.
sidebar:
  order: 13
---

Every archived session of a quiz stays in its history: the leaderboard, the success rate, the results by question and, when you chose so, every answer of every player. This page says where to find them and what each report holds.

## What is kept

What a session keeps depends on choices you make before it starts (see [Start a room](/docs/host/start-a-room/)):

| Choice | Default | What it keeps |
|---|---|---|
| **Archive this quiz's results**, when you close the room or go **Back to the lobby** from the podium | ticked | The session in **History**. Unticked, nothing is kept. |
| **Keep what was played so far**, when you choose **Stop the quiz…** | ticked | The session in **History**, as interrupted. Unticked, nothing is kept. |
| **Personalised tracking**, in the lobby | on | Each player's rank, score, right answers and streak. Off, only the group's overall results. |
| **Record all answers**, in the lobby | off | Every answer of every player, question by question. |

In open access, personalised tracking is not available: participants have no account, and only the group's results are kept.

A session that ends because the host did not come back, or a quiz stopped with **Keep what was played so far**, is archived as **Interrupted**.

Players see a notice on their phone that says what is recorded about them.

## Open a quiz's history

1. Open the quiz in the editor.
2. In **More**, choose **History**.

**Session history** lists the archived sessions of this quiz:

- **Date**, with the PIN and the duration;
- **Status**: **Ended**, **Interrupted** or **Archived**, plus **Capture** when every answer was recorded, and **Room · {n} quizzes** when the session was one of several quizzes played in a room;
- **Participants**;
- **Success**: the share of right answers.

History is per quiz: there is no page that lists every session of every quiz. Administrators have an instance-wide view in [Statistics](/docs/admin/statistics/).

## A session's report

Open a session to see:

- **Players**, **Overall success** and **Questions** at the top;
- **Results by question**: for each question, how many **Answers**, the **Success** rate and the **Avg. time**;
- **Players**: **Rank**, **Nickname**, **Score**, **Correct** and **Streak** for each player. With personalised tracking off, this table is replaced by "No individual result was recorded for this session".

When the session was played in a room with other quizzes, a **Room** section lists them and shows the **Room standings**, summed over the archived quizzes of the room. The room standings need personalised tracking in every one of its sessions.

## A player's answers

Open a player from the session's **Players** table. The page sums up their rank, score and right answers. With **Record all answers**, it lists every answer: the **Question**, their **Answer**, whether it was **Correct**, the **Points** and the **Time**. Without it, the page says "Answer details are not available: full capture was not enabled for this session."

## Player feedback

When **Allow player feedback** is on in the quiz's settings, players can rate the quiz from 1 to 5 stars at the end, with an optional comment. The settings then show **See all {n} reviews**, which opens the reviews, with a filter by rating.

When the room goes on to another quiz, its lobby still offers the card for the quiz just played: "Your feedback on the previous quiz".

## How long results are kept

Archived sessions are kept for 365 days. After that, whoever runs your instance can purge them; nothing is deleted automatically. You cannot delete a single session from the history. See [Privacy and retention](/docs/admin/privacy-and-retention/).

## Questions

### I closed the room but the session is not in History. Why?

**Archive this quiz's results** was unticked when the room closed or when you went **Back to the lobby**, **Keep what was played so far** was unticked when you stopped the quiz, or the quiz was deleted while it was played. Neither can be undone.

### Can I see each player's answers after the game?

Only if **Record all answers** was on before the quiz started. It cannot be turned on afterwards.

### Can I compare two sessions of the same quiz?

Side by side, no. Each session has its own report, and **Session history** shows their success rates in one list. To compare in a spreadsheet, export each session's CSV; see [Export results](/docs/host/export-results/).

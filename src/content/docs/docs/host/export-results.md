---
title: Export results
description: The three CSV files QuizDock exports from a session's report, their columns and format, and the exports that do not exist.
sidebar:
  order: 14
---

QuizDock exports results as CSV files, from the session reports in **History**. There are exactly three, each built in your browser from the report on screen. This page lists them, their columns, and what cannot be exported.

## The three CSV exports

| Export | Where | One row per | Columns | Needs |
|---|---|---|---|---|
| Session leaderboard | A session's report, **Export (CSV)** | player | Rank, Nickname, Score, Correct, Answered, Max streak, Average time (s) | **Personalised tracking** |
| Room standings | A session's **Room** section, **Export standings (CSV)** | player | Rank, Nickname, Score, Correct, Answered, Max streak, Average time (s), Quizzes | Several quizzes in one room, all with personalised tracking |
| A player's answers | A player's page, **Export (CSV)** | answer | #, Question, Answer, Correct (yes or no), Points, Time (s) | **Record all answers** |

To get one:

1. Open the quiz in the editor, then **More** and **History**.
2. Open a session.
3. Choose **Export (CSV)** for the leaderboard, or **Export standings (CSV)** in the **Room** section, or open a player and choose **Export (CSV)** there.

The button is greyed out when there is nothing to export: no player in a session without personalised tracking, no standings in a room.

## The file format

- Fields are separated by semicolons (`;`), which spreadsheet software in many languages reads directly.
- The file is UTF-8 with a byte-order mark, so accents and non-Latin nicknames open correctly in Excel.
- A text that starts with `=`, `+`, `-` or `@` is prefixed with an apostrophe, so a nickname cannot run as a spreadsheet formula.
- Times are in seconds, with one decimal.
- The file is named after what it holds: the quiz title and the PIN for a session (`discover-france-482913.csv`), the room's PIN for room standings, the nickname for a player.

The export is made in the browser from the report: nothing is sent anywhere.

## What cannot be exported

These exports do not exist in QuizDock today:

- the **Results by question** table (answers, success rate and average time per question): read it on screen;
- the answers of every player in one file: export each player's page;
- PDF or Excel (`.xlsx`) files;
- player feedback (ratings and comments): read it under **See all {n} reviews**;
- the sessions of several quizzes, or every session of a quiz, in one file.

**Export** in the editor's **More** menu exports the quiz itself (questions and media) as a bundle, not its results. See [Import a quiz](/docs/host/import-a-quiz/).

## Questions

### The CSV opens as a single column. What do I do?

Your spreadsheet expects commas. Import the file and choose the semicolon as separator: in Excel, **Data › From Text/CSV**; in LibreOffice, the import dialog asks; in Google Sheets, **File › Import** with a custom separator `;`.

### Can I export each player's answers for an assessment?

Yes, if **Record all answers** was on before the quiz started. Open each player from the session's report and choose **Export (CSV)**. It keeps every answer with its nickname, which is personal data: tell the participants beforehand.

### Can I get the results automatically after each session?

No. Exports are made by hand from the report.

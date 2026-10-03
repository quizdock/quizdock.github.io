---
title: Scoring
description: How QuizDock scores an answer, with examples, the speed bonus, the streak bonus, partial credit, typo tolerance and closest-answer questions.
sidebar:
  order: 12
---

QuizDock scores every answer on the server, with the same rules for everyone. This page explains them with examples, so you can choose a question's **Points** and **Scoring** knowing what players will get. Players see a one-line rule under each question, such as "Several correct answers — each right tick counts, each wrong one cancels one."

## Points per question

**Points** sets what a right answer is worth:

| Points | A right answer earns |
|---|---|
| **Standard** | Up to 1000, more for a faster answer. |
| **Double** | Up to 2000, more for a faster answer. |
| **Fixed (no speed bonus)** | 1000, whatever the speed. |

A **Poll** never gives points. A question imported with no points keeps none.

## The speed bonus

A right answer earns all its points when it is instant, and half of them at the very end of the time. In between, the points go down evenly.

For a **Standard** question with 20 seconds:

| Answered after | Points |
|---|---|
| 0 s | 1000 |
| 5 s | 875 |
| 10 s | 750 |
| 20 s | 500 |

A **Double** question answered after 5 seconds earns 1750. A **Fixed** question earns 1000 at any moment.

Time counts from the moment the answers open (after the reading time) to the moment the server receives the answer.

## The streak bonus

Right answers in a row add a bonus: +100 for the second, +200 for the third, and so on, up to +500 from the sixth onwards. The first right answer has no bonus.

- A wrong answer resets the streak. No answer, or an answer that arrives too late, leaves it as it was.
- A poll, or a question with no points, leaves the streak as it was.
- A partly right answer (partial credit) neither grows nor breaks it.

Example: a player answers five Standard questions right in a row, each after 5 seconds of 20. They earn 875, 975, 1075, 1175 and 1275 points.

## Late and early answers

An answer that arrives after the question closed (the end of the time, plus a grace of 0.3 seconds) is refused before it is scored: it earns nothing and leaves the streak as it was. The player sees "Your answer arrived too late: it is not counted." An answer sent before the answers open is refused, and the player can answer again.

## Scoring variants

Some types offer a **Scoring** choice.

### Multiple choice (multiple answers) and Image choice with several right pictures

- **All or nothing** (default): every right answer ticked and no wrong one, or nothing.
- **Partial credit**: each right tick earns its share, each wrong tick cancels one, never below zero. The share applies to the timed points.

Example: three right answers out of six. A player ticks two right ones and one wrong one after 5 seconds of 20: (2 − 1) / 3 = one third of 875, so 292 points.

### Reorder

- **All or nothing** (default): every item in its place.
- **Partial credit**: the share of items in the right position. Four items with two swapped: two of four in place, half the timed points.

### Text input

- **Exact match** (default): the answer must equal one of the accepted answers, once case, accents and extra spaces are set aside. "paris", "PARIS" and " Paris " all match "Paris".
- **Tolerate typos**: one edit (a letter added, removed or changed) is forgiven when the accepted answer has up to 5 letters, two beyond. "Pari" matches "Paris"; "Lisbonn" matches "Lisbon".

### Numeric

- **Within tolerance** (default): an answer within ± tolerance of the target is right, with the speed bonus.
- **Closest answer wins**: settled at the reveal, once every answer is in. Answers are ranked by distance to the target (equal distances share a rank). An answer within the tolerance earns full points. The others earn 100, 75, 50 or 30 % of the points by rank, and 10 % beyond the fourth. No speed bonus: precision is the game.

Example: "In which year did the Eiffel Tower open?", target 1889, tolerance 0, Standard points. Answers 1889, 1887, 1900 and 1850 earn 1000 (exact), 750 (second), 500 (third) and 300 (fourth). The reveal shows the closest answers, and each player sees their own rank and distance.

An exact answer counts as right for the streak; a near miss neither grows nor breaks it.

## Scores in a room with several quizzes

Each quiz scores from zero. When a room plays several quizzes, **Room standings** and the **Room podium** add up the archived quizzes. See [Start a room](/docs/host/start-a-room/).

## Questions

### Does a slow connection cost points?

A little. The server times an answer when it receives it, and QuizDock does not compensate for network delay. On a local network the difference is small; on a poor mobile connection it can cost some of the speed bonus, or the answer itself when it arrives after the question closed.

### How do I remove the speed factor?

Choose **Fixed (no speed bonus)** in **Points**. Right answers then earn 1000 whatever the speed; the streak bonus still applies.

### Can I give fewer points for a hard question?

No. Points are 1000, 2000 or fixed at 1000; there is no custom value. Use **Double** for the questions that should count more.

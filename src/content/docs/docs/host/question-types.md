---
title: Question types
description: The eight QuizDock question types, what each asks of the players, its options in the editor and how it is scored.
sidebar:
  order: 3
---

QuizDock has eight question types. Pick one in the question form's **Type** field. This page says what each asks of the players, what you fill in, and how it is scored. The points themselves are on [Scoring](/docs/host/scoring/).

## Summary

| Type | Players | Answers you set | Scoring options |
|---|---|---|---|
| **Multiple choice (single answer)** | pick one | 2 to 8 options, one correct | right or wrong |
| **Multiple choice (multiple answers)** | tick several, then submit | 2 to 8 options, at least one correct | **All or nothing**, **Partial credit** |
| **True / False** | pick one | two fixed options, one correct | right or wrong |
| **Text input** | type an answer | up to 20 accepted answers | **Exact match**, **Tolerate typos** |
| **Numeric** | enter a number | **Target value** and **Tolerance ±** | **Within tolerance**, **Closest answer wins** |
| **Reorder** | put the options in order, then submit | 2 to 8 options, each with its place | **All or nothing**, **Partial credit** |
| **Poll** | give an opinion | 2 to 8 options, none correct | no points |
| **Image choice** | pick one picture, or tick several | 2 or 4 pictures, each with alternative text | right or wrong; with several right pictures, **All or nothing** or **Partial credit** |

Every type except **Poll** takes **Points**: **Standard**, **Double** or **Fixed (no speed bonus)**.

Players see a one-line rule under each question, such as "One correct answer — pick it." or "Type your answer — small typos are forgiven.", so the scoring is never a surprise.

## Colours and shapes

Each answer has a colour and a shape, fixed by its position: red triangle, blue diamond, yellow circle, green square, purple star, orange hexagon, pink heart, teal cross. The shape appears wherever the answer does (big screen, phones, reveal), so nobody depends on colour alone. In the room, phones show the coloured tiles and the big screen shows the text. See [Accessibility](/accessibility/).

## Multiple choice (single answer)

One correct answer among 2 to 8 options, each up to 500 characters. Tick **Correct** on the right one. **Add an option** adds one, up to 8.

Scoring: the right option earns the points, faster answers earn more, and a streak of right answers adds a bonus.

## Multiple choice (multiple answers)

Several correct answers. Players tick every answer they think is right, then choose **Submit my answer**. Tick at least one option as **Correct**.

Scoring:

- **All or nothing** (the default): every right answer ticked, and no wrong one.
- **Partial credit**: each right tick earns its share, each wrong tick cancels one. The share never goes below zero.

## True / False

Two fixed options, **True** and **False**. Tick the right one. The fastest type to play.

## Text input

Players type their answer. List the spellings you accept under **Accepted answers** (**Add an answer**, up to 20, each up to 200 characters). Case, accents and extra spaces are ignored when comparing.

Scoring:

- **Exact match** (the default): the answer must match one of the accepted answers, once case and accents are set aside.
- **Tolerate typos**: one edit (a letter added, removed or changed) is forgiven for an answer of up to 5 letters, two beyond.

List the real alternatives (for example "Lisbon" and "Lisboa"); typo tolerance is not a synonym list.

## Numeric

Players enter a number. Set the **Target value** and the **Tolerance ±** (0 for the exact number). Decimals are fine: 3.14, 0.5.

Scoring:

- **Within tolerance** (the default): an answer within ± tolerance of the target counts as right; points scale with speed.
- **Closest answer wins**: scored at the reveal, once every answer is in. An answer within the tolerance earns full points; the others are ranked by distance. No speed bonus. The reveal shows the closest answers, and each player sees their own rank and distance.

## Reorder

Players put the options in the right order, by dragging or with **Move up** and **Move down**, then submit. Give each option its place in the right order; the order in which you list them is the order players first see.

Scoring:

- **All or nothing** (the default): every item in its place.
- **Partial credit**: the share of the items at the right position.

## Poll

Opinion only: no correct answer and no points. Set 2 to 8 options. At the reveal, the distribution of the answers is shown. A poll leaves the players' streaks untouched.

## Image choice

The answers are pictures: choose **How many** (2 or 4), then a picture for each, with its colour and shape. Each picture needs an **Alternative text**: it is the answer for whoever cannot see it. Pictures are cropped to fill their tile, as the big screen shows them. An image choice has no picture or video of its own (its answers are the pictures), but it can play a sound.

Tick the right picture. Turn on **Several right answers** to let players tick every right picture, then submit; it is then scored like a multiple choice, with **All or nothing** or **Partial credit**.

## Questions

### Can I make a question that gives no points?

Use a **Poll** for an opinion question. For a question with a right answer, every type in the editor gives points; **Fixed (no speed bonus)** removes the speed factor. A quiz imported with no-points questions keeps them as they are.

### Is there a word cloud or open-ended question?

No. Text input compares the answer with the accepted answers; there is no free-text question without a right answer.

### Do players see the question on their phone?

In the room, the question and its media are on the big screen and phones show the answer tiles. A participant who joins as **Remote** gets the whole question on their device. See [Remote participants](/docs/host/remote-participants/).

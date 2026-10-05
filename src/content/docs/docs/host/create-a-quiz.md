---
title: Create a quiz
description: Create a quiz in the QuizDock editor, set its sound and sharing options, add questions and slides, preview it and publish it.
sidebar:
  order: 2
---

A quiz is a list of questions and slides, played in order. This page covers the editor as a whole: the quiz's settings, the list, the question form, the preview and the status that decides whether a quiz can be played.

## Create the quiz

In **My quizzes**, choose **New quiz**. The draft is not a blank page: it opens with an intro slide that shows `{title}` and `{description}` on a random gradient, followed by a first multiple-choice question. The intro follows the quiz as you rename it.

The editor header holds the title (edit it in place), the status, **Preview** and **More**. **More** opens **History**, **Export**, **Export for publication**, **Share as a template** (once the quiz is ready), **Archive** and **Delete quiz**.

## Settings

- **Title** and **Description**.
- **Sound**:
  - **Pause after a media**: when a question's sound or video lasts longer than its timer, the question is stretched to the end of the media plus this pause, so nothing is cut mid-play. 1 second by default.
  - **Sound levelling**: the level every sound and video is brought to at playback: **Loud (−14 LUFS, streaming)**, **Balanced (−16 LUFS)** (the default) or **Calm (−23 LUFS, broadcast)**. The files are not changed.
  - **Who hears the sound**: **Projection only**, **Projection and remote participants** (the default) or **Every device**. See [Sound and projection](/docs/host/sound-and-projection/).
- **Language & sharing**:
  - **Language**: the language the quiz is written in. The participants' screens follow it, unless the room picks another; a new true or false question starts with **True** and **False** in it.
  - **Licence**: **CC0 — no conditions**, **CC BY 4.0 — credit the author** or **CC BY-SA 4.0 — credit, share alike**. Required to share the quiz as a template.
  - **Tags**: up to 5 keywords. Press Enter to add one.
  - **Share with the instance’s other hosts**: they see the quiz in their list, read-only, and can **Create a quiz from this** to get their own copy.
- **Allow player feedback**: a rating panel (1 to 5 stars and an optional comment) is offered at the end of the quiz, every time it is played. It is on for a new quiz. Once reviews come in, **See all {n} reviews** opens them.

## The list of questions and slides

Choose **Add** for a question or **Add a slide** for a slide. Reorder by dragging an item, or with **Move up** and **Move down**. An item that is not complete yet is marked **Unfinished**.

## The question form

Every question has:

- **Type**: one of the eight [question types](/docs/host/question-types/). Changing the type clears the right answers: tick them again under the new rules.
- **Prompt**: up to 1000 characters, in Markdown. Switch between **Visual editor** and **Markdown**.
- The answers, as the type asks for them: **Answer choices**, up to 500 characters each, at most 8.
- **Answer explanation (shown with the right answer)**: optional, up to 2000 characters.
- **Timing**: **Time (s)**, 5 to 240 seconds, 20 by default. **Answer shown for (s)**, 1 to 300 seconds, applies in auto mode only: how long the right answer stays on screen before moving on. Empty means the instance's setting, shown in the field, for example "auto (5 s)".
- **Points**: **Standard**, **Double** or **Fixed (no speed bonus)**. **Scoring** appears for the types that offer a variant. See [Scoring](/docs/host/scoring/).
- **Background**: **White**, **Image** or **Gradient**.
- **Picture on the big screen**: **Below the text**, **Above the text**, **Left of the text** or **Right of the text**.
- **Question media**: a picture or a video, and a sound. See [Media](/docs/host/media/).

Save a question with **Save** (**Add** for a new one), or with Cmd+S (macOS) or Ctrl+S from any of its fields: the form stays open. Leaving a question with unsaved changes asks first, and offers to save it on the way (**Save and continue**, **Save and close**).

At the top of the question form, a folded **Preview** shows the question as it is being written, on the **Projection** or a **Phone**, with **Show the answer**. It stays open or folded from one question to the next. **Pin** keeps it at the top while the form scrolls; **Unpin** releases it.

## Preview

**Preview** in the header opens the quiz in a new tab, as players and the big screen will see it. Choose the **Device** (**Projection** or **Phone**), step with **Previous** and **Next**, use **Show the answer** and **Fullscreen**. **Credits** lists the credits of the quiz's media.

## Draft, ready, archived

| Status | What it means |
|---|---|
| **Draft** | Keeps whatever you save, complete or not. It cannot be played. |
| **Ready** | Can be presented at any time. Every step must be complete. |
| **Archived** | Leaves the main list. **Restore** brings it back. |

**Publish (ready)** needs at least one question and every step complete. When something is missing, a checklist names each step to finish, with **Open** to go to it. A ready quiz offers **Back to draft**, **Present** and **Archive**.

A ready quiz only takes complete questions and slides. To save an unfinished one, the editor offers to move the quiz back to draft first.

## Editing a quiz while it is played

You can edit a quiz while a room plays it. Layout and presentation edits (backgrounds, contrast, explanations, slides) reach the rooms at their next step. Questions and answers stay as they were when the room was launched.

A quiz cannot be deleted while a room plays it: close the room first.

## Questions

### Is there a version history of my quiz?

No. The editor saves your changes; there is no list of earlier versions to restore. **History** in **More** lists the quiz's past sessions, not its versions. If the tab closes or reloads before you save a question or a slide, the same browser recovers your unsaved changes when the form reopens: **Draft restored — your unsaved changes were recovered.** To keep a copy of a given state, use **Export**.

### What happens if two people edit the same quiz?

If two saves arrive at the same time, the second gets **Someone saved at the same time. Try again.** Only the owner edits a quiz; other hosts see a shared quiz read-only.

### Can I keep every answer of every participant?

Yes, on request. A ready quiz offers **Full answer capture the next time it is played**, and the lobby offers the same choice as **Record all answers**. It keeps personal data: inform the participants. See [Reports and history](/docs/host/reports-and-history/).

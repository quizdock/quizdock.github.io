---
title: Slides
description: Add slides between QuizDock questions, with headings, text, images, columns, a background, a video or a sound, and variables filled in live.
sidebar:
  order: 4
---

A slide is a step without answers: an introduction, a rule, a transition, a "next round" screen. It shows on the big screen and on the players' devices. Every new quiz opens on an intro slide; add others with **Add a slide** in the list.

## Content

Build a slide from blocks, under **Content**:

- **Heading** and **Subheading**, with a **Level**.
- **Text**, in Markdown, with a **Text size** (S, M, L) and a **Text alignment**.
- **Image**, with a **Size** (**Small**, **Medium**, **Large**, **Full width**) and an **Alignment** (**Left**, **Centre**, **Right**).
- **2 columns** or **3 columns**, with a **Column split**; each column holds its own blocks.

Drag a block to reorder it, or remove it (**Undo** brings it back). A slide holds up to 30 blocks, 10 per column. An empty block (a heading without text, an image without its picture) is left out when you save. The **Preview** beside the form shows the slide as it will appear; **Hide** and **Show** fold it.

A slide must show something: a heading, a text, an image, a background or a video. A draft can keep an empty slide for later; a ready quiz cannot, and the editor offers to move the quiz back to draft to save it as it is.

## Background and contrast

**Background** is **White**, an **Image** or a **Gradient** (two or more colours with **Add a colour**, and an **Angle**). On a picture or a gradient, choose the **Text contrast**: **Light text** or **Dark text**, and **Outline (halo, like subtitles)** to keep text readable on a busy picture.

## Slide media

Under **Slide media**, a slide can have a video, a sound, or both:

- A video **Fills the slide behind its content (cropped to the screen).**
- **Loop**: the video runs as long as the slide shows. Off, it plays once and stays on its last frame, and in automatic mode the slide waits for its end.
- **Sound**: plays the video's own sound. Off, the video is muted and the slide can have a sound of its own.

A slide plays one sound at a time: either the video's sound or a separate sound, not both. Who hears it follows the quiz's setting; see [Sound and projection](/docs/host/sound-and-projection/). Upload rules are on [Media](/docs/host/media/).

## Auto-advance

**Auto-advance (automatic mode)** decides how long a slide stays when the room runs in **Autoplay**:

- **Default duration (5 s)**;
- **Manual: the host clicks**;
- **Custom duration…**, from 0 to 600 seconds.

In manual mode the host always moves on by hand, whatever is set here.

## Variables

Write a variable in a heading or a text; it is replaced wherever the slide shows. The quiz's variables appear filled in the preview, the room's once the quiz is played.

| Variable | Replaced by |
|---|---|
| `{title}` | The quiz's title |
| `{description}` | The quiz's description |
| `{questions}` | How many questions it has |
| `{author}` | Its author |
| `{tags}` | Its tags |
| `{license}` | Its licence |
| `{room}` | The room's name |
| `{host}` | The host's name |
| `{pin}` | The room's PIN |
| `{join}` | The address to join (host/join) |
| `{players}` | How many participants are connected |
| `{question}` | The number of the question that follows the slide |
| `{total}` | How many questions the quiz has |
| `{remaining}` | How many questions are left, the next one included |
| `{date}` | Today's date |
| `{time}` | The time |

For example, a slide halfway through can read "Round two: `{remaining}` questions to go" and a welcome slide "Join at `{join}` with PIN `{pin}`".

## Questions

### Can a slide embed a YouTube video?

No. A slide plays a video you upload. QuizDock does not embed videos from other sites.

### Do slides count in the score?

No. Slides carry no answers and no points.

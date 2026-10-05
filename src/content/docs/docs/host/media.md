---
title: Media
description: Add pictures, videos and sounds to QuizDock questions and slides, what the editor converts, the size limits, alt text, credits and the media library.
sidebar:
  order: 5
---

Questions and slides can carry pictures, videos and sounds. You upload the file in the editor; the browser converts it, and QuizDock plays it in sync on the big screen and on the devices that should hear it. This page covers the editor side. For the overview, see [Media](/media/).

## The two slots of a question

Under **Question media**, a question has two slots:

- **Visual**: **None**, an **Image** or a **Video**.
- **Sound**: a sound of its own.

A video already carries its own sound, so a question takes either a video, or a picture and a sound, never a video and a separate sound. Choose where the picture sits with **Picture on the big screen**. An **Image choice** question has no visual of its own: its answers are the pictures, and it can still play a sound.

Slides have their own media (a full-slide video, a sound); see [Slides](/docs/host/slides/).

## Use Chrome or Edge to upload

The browser converts every file before sending it; the server never converts anything. Conversion and playback are built and tested on Chromium browsers (Chrome, Edge). Firefox cannot convert video to H.264: upload videos from Chrome or Edge. In other browsers, the editor, the console and the projection show **This page is built for Chrome, Edge or another Chromium browser.**

What the editor makes of your file:

| You upload | Stored as |
|---|---|
| A picture | WebP, at most 1920 pixels. An animated GIF keeps only its first frame. |
| A video | MP4 (H.264 video, AAC sound), at most 1080p and 30 frames per second, compressed to fit the size limit. |
| A sound | M4A (AAC). |

SVG pictures are refused. A QuickTime `.mov` is converted to MP4 like any other video. When a browser cannot read or convert a file, convert it first with a dedicated tool: HandBrake for videos (MP4 H.264), Audacity for sounds. A video shot on an iPhone is often HEVC: convert it, or set the camera to "Most Compatible".

The same file uploaded twice is recognised and stored once.

## Size limits

By default, a picture can weigh up to 10 MB, a video up to 50 MB and a sound up to 10 MB. Whoever runs your instance can change these limits (see [Settings](/docs/admin/settings/)). A video too long to fit, even compressed, is refused: shorten it first.

On the [live demo](https://quizdock-standalone.onrender.com) uploads are off, including the media inside an imported quiz.

## Alternative text and credits

- **Alternative text**: read aloud by screen readers. Describe what the picture shows when it carries part of the question; leave it empty when it is decoration. In an **Image choice**, every picture needs one: it is the answer for whoever cannot see it.
- **Credit**: author, licence and source, for example "Photo: Lin Wei, CC BY 4.0, openverse.org". It shows in the preview's **Credits** and at the end of the quiz. A CC BY licence asks for it.

Credits matter if you share the quiz: **Export for publication** lists every media without one. See [Templates and community](/docs/host/templates-and-community/).

## The media library

Every media you upload is kept in your library, to use again. Open it from a slot (**My images**, **My videos**, **My sounds**):

- **My media**: your own files. Search by name, alt text or credit. Each one shows **Used in {n} quizzes**, **Unused**, or **Kept for past results** when only an archived session still shows it. You can delete a media no quiz uses.
- **Global media**: files the administrators provide to every host. Picking one gives you your own copy, with its credit.
- **Find elsewhere:** links to free libraries such as Openverse or Wikimedia Commons, when the instance offers them.

Reusing a media from the library brings its alternative text and credit with it. A media that no quiz and no session uses is removed after a day.

A picture written into the prompt's Markdown can come from the web. The editor suggests **Move to the media**: in the media slot it is framed on every screen, zoomable on phones and loaded ahead.

## Sound options of a question

When a question has a sound or a video:

- **Who hears this sound**: **The quiz's setting in the room** (the default), **Projection only**, **Projection and remote participants** or **Every device**. "Every device" includes the phones in the room, which echo if they share it.
- **Waveform size**: **Small**, **Medium**, **Large** or **Hidden**. The waveform is drawn on the big screen and the phones; hidden, the sound still plays and your console still shows it.
- **Start the timer when the media ends**: listen first, then answer. Nobody can answer while the sound or video plays, and everyone gets the full time afterwards.

Without "listen first", a media longer than the question's time stretches the question: it lasts until the end of the media plus the quiz's **Pause after a media**. The form says so, for example: "The media lasts 45 s: the question will last 46 s (end of the media + the quiz’s 1 s pause)."

Every sound and video is levelled at playback to the quiz's **Sound levelling**, so the volume stays even from one question to the next; the file itself is not changed.

## In the room

Phones in the room show a question's picture; they play its video only when its sound reaches **Every device**, otherwise the big screen does. A participant playing remotely gets the whole question, video and sound included. To avoid waits, devices receive the next question's media a few seconds before it appears, never its text or answers. See [Sound and projection](/docs/host/sound-and-projection/).

## Questions

### Can I embed a YouTube or Vimeo video?

No. QuizDock plays videos you upload. Download the video (when its licence allows) and upload it.

### Why was my video refused?

Most often it is an HEVC video from an iPhone, or a sound track that is not AAC, in a browser that cannot convert it. Upload it from Chrome or Edge, which convert it, or convert it first to MP4 H.264 + AAC with HandBrake. See [Troubleshooting](/docs/host/troubleshooting/).

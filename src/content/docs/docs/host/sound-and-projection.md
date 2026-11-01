---
title: Audio and projection
description: Put the QuizDock projection on the big screen, from your computer or another one, turn its audio on, set the lobby's effects and music, and control media from the console.
sidebar:
  order: 13
---

In a lobby you work with two screens: the console, for you, and the projection, for the audience. The projection plays the audio; the console stays silent. This page covers setting both up, the lobby's audio, and controlling media during the game.

## The console and the projection

The console has three views: **Console** (your controls), **Projection** (what the big screen shows) and **Participant** (a read-only preview of what a phone shows).

To put the projection on the big screen:

1. In the console, choose **Projection window**, at the end of the second row. It opens the projection in a new tab.
2. Drag that tab out of the browser window, onto the projector or the second screen.
3. Choose **Fullscreen** in it.
4. Click once anywhere in the projection and choose **Turn audio on**.

The browser allows audio only after a click in the window that plays it, not in the console. Once is enough for the whole lobby.

The console never plays the quiz's audio, so you can keep it on a laptop facing you. Use Chrome or Edge for the console and the projection: they are what QuizDock is built and tested on.

## Project from another computer

When the projector hangs on another computer than yours, make a screen on that computer the lobby's projection:

1. In the console, choose **⋮** next to **Projection window**: **Project from another computer**.
2. On the computer connected to the projector, open the address it shows, or scan its QR code. Its **Share** sends that address alone, through the share sheet or the clipboard.
3. That screen shows a **Projection code** of 4 digits, in its bottom-left corner.
4. Type it in **Code shown on that screen** and choose **Make it the projection**. The console says "That screen is now the lobby's projection."

The screen stays the projection when it reloads or reconnects. Then choose **Fullscreen** and **Turn audio on** in it, as above.

Only the projection (the window **Projection window** opens, or a screen you paired) drives the media: it plays the audio, the console waits for it before a question with media, and the other devices follow its place in an audio file or a video. Any other screen opened with the PIN is a copy, like a participant's: it follows the game and drives nothing.

## Lobby audio

**Lobby audio** sets the effects and the music the projection plays around the questions. Everything is off in a new lobby. Open it from the console's second row, in the lobby or at any moment of the game.

| Effect | When it plays |
|---|---|
| **Answer received** | Each time an answer comes in. |
| **Question start** | When each question appears, except a question that plays its own audio or video. |
| **Time's up** | When the question ends: on zero, or as soon as everyone has answered. |
| **Countdown** | Over the last five seconds of the time, the end effect on zero. Stops if everyone has answered. |
| **Music** | A background track while players answer. It steps out while a question plays its own audio or video, and between questions, then comes back where it was. |

Each effect is either **Built-in (synthesised)** or **An audio file from the library…**: upload one, or take one of your audio files or of the instance's. The music is **None** or an audio file from the library. **Hear "{name}" (here only)** plays an effect on your own device to check it. When the quiz's [theme](/docs/host/quiz-themes/) has an effect of its own, it plays instead of the built-in one; an effect you pick here still wins.

Three levels balance the lobby: **Media** (the quiz's own audio and videos), **Music** and **Effects**. **Projection audio** switches the projection's audio off and on; while it is off the console shows **Lobby muted**, and the levels are kept for when it is back.

The projection plays all of it. Participants following from home also hear the music and the effects; phones on site stay silent. See [Remote participants](/docs/host/remote-participants/).

## The quiz's own audio and videos

Which devices play a question's audio or video follows the quiz's **Who hears the audio**, a question's **Who hears this audio**, and the lobby's **Who hears the audio in this quiz**. Every audio and video is played at the quiz's **Audio levelling**, so the volume stays even. See [Media](/docs/host/media/).

During a question with media, the console shows the transport:

- play and pause, and **Restart the media from the top**;
- click the waveform to move in the audio.

Moving in the audio does not change the timer. On a question set to **Start the timer when the media ends**, the audio cannot be moved until it ends ("The answers open when the audio ends"), and pausing pauses the game.

## Waiting for the media

Before a question with media, every device that plays it loads the file. The console shows **Next media loaded: 12 / 14 devices**, and whether the projection is ready. The question starts when every device is ready, or when the wait runs out (10 seconds by default, set for the instance). **Start anyway** starts without the late devices; **Still loading:** names them.

## Animations

**Animations** switches the transitions between steps on and off for this lobby. Turn them off for a slow projector. A device whose system asks for reduced motion keeps simple fades only.

## Each device's own mix

Every device has **This device’s mix**: its own volume and mute for **Questions**, **Music**, **Effects** and **Interface**. It changes only that device. The lobby's music and effects are yours to set.

## Questions

### Why is there no audio on the big screen?

The projection window needs one click, in that window: choose **Turn audio on**. Then check that **Projection audio** is on in **Lobby audio**, and the computer's own volume and output.

### Why do I hear nothing on my laptop?

The console is silent on purpose. Audio comes from the projection window. To check an effect, use **Hear "{name}" (here only)** in **Lobby audio**.

### Can the phones on site play the audio?

Yes, with **Every device**. Phones that share a space then echo each other, so keep it for players in different places.

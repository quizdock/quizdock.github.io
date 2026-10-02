---
title: Sound and projection
description: Put the QuizDock projection on the big screen, turn its sound on, set the room's effects and music, and control media from the console.
sidebar:
  order: 11
---

In a room you work with two screens: the console, for you, and the projection, for the audience. The projection plays the sound; the console stays silent. This page covers setting both up, the room's sound, and controlling media during the game.

## The console and the projection

The console has three tabs: **Console** (your controls), **Projection** (what the big screen shows) and **Participant** (a read-only preview of what a phone shows). **Open in a window** opens a tab in its own window.

To put the projection on the big screen:

1. In the console, choose **Projection window**. It opens the projection in a new window.
2. Drag that window to the projector or the second screen.
3. Choose **Fullscreen** in it.
4. Click once anywhere in the projection window and choose **Turn sound on**.

The browser allows sound only after a click in the window that plays it, not in the console. Once is enough for the whole room.

The console never plays the quiz's sound, so you can keep it on a laptop facing you. Use Chrome or Edge for the console and the projection: they are what QuizDock is built and tested on.

## Room sound

**Room sound** sets the effects and the music the projection plays around the questions. Everything is off in a new room. Open it in the lobby, or from the console's control bar at any moment of the game.

| Effect | When it plays |
|---|---|
| **Answer received** | Each time an answer comes in. |
| **Question start** | When each question appears, except a question that plays its own sound or video. |
| **Time's up** | When the question ends: on zero, or as soon as everyone has answered. |
| **Countdown** | Over the last five seconds of the time, the end sound on zero. Stops if everyone has answered. |
| **Music** | A background track while players answer. It steps out while a question plays its own sound or video, and between questions, then comes back where it was. |

Each effect is either **Built-in (synthesised)** or **A sound from the library…**: upload one, or take one of your sounds or of the instance's. The music is **None** or a sound from the library. **Hear "{name}" (here only)** plays a sound on your own device to check it.

Three levels balance the room: **Media** (the quiz's own sounds and videos), **Music** and **Effects**. **Projection sound** switches the projection's sound off and on; while it is off the console shows **Room muted**, and the levels are kept for when it is back.

The projection plays all of it. Participants following from home also hear the music and the effects; phones in the room stay silent. See [Remote participants](/docs/host/remote-participants/).

## The quiz's own sounds and videos

Which devices play a question's sound or video follows the quiz's **Who hears the sound**, a question's **Who hears this sound**, and the lobby's **Who hears the sound in this quiz** for this room. Every sound is played at the quiz's **Sound levelling**, so the volume stays even. See [Media](/docs/host/media/).

During a question with media, the console shows the transport:

- play and pause, and **Restart the media from the top**;
- click the waveform to move in the sound.

Moving in the sound does not change the timer. On a question set to **Start the timer when the media ends**, the sound cannot be moved until it ends ("The answers open when the sound ends"), and pausing pauses the game.

## Waiting for the media

Before a question with media, every device that plays it loads the file. The console shows **Next media loaded: 12 / 14 devices**, and whether the projection is ready. The question starts when every device is ready, or when the wait runs out (10 seconds by default, set for the instance). **Start anyway** starts without the late devices; **Still loading:** names them.

## Animations

**Animations** switches the transitions between steps on and off for this room. Turn them off for a slow projector. A device whose system asks for reduced motion keeps simple fades only.

## Each device's own mix

Every device has **This device’s mix**: its own volume and mute for **Questions**, **Music**, **Effects** and **Interface**. It changes only that device. The room's music and effects are yours to set.

## Questions

### Why is there no sound on the big screen?

The projection window needs one click, in that window: choose **Turn sound on**. Then check that **Projection sound** is on in **Room sound**, and the computer's own volume and output.

### Why do I hear nothing on my laptop?

The console is silent on purpose. Sound comes from the projection window. To check a sound, use **Hear "{name}" (here only)** in **Room sound**.

### Can the phones in the room play the sound?

Yes, with **Every device**. Phones that share a room then echo each other, so keep it for players in different places.

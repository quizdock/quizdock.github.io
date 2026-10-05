---
title: Remote participants
description: Let QuizDock players follow from home or another room, with the whole question, its video and its sound on their own device.
sidebar:
  order: 10
---

Players who cannot see the big screen can still play. A remote participant gets the whole question on their own device: its text, its answers, its picture, and its video and sound. This page covers how players choose, who hears what, and the limits.

:::caution[Experimental]
Remote participation works, but it is the least tested part of QuizDock. It is built and tested on Chromium browsers (Chrome, Edge); iPhone Safari has not been tested. Try it with your audience's devices before a session that matters.
:::

## How a player becomes remote

The join form asks every player **Where are you playing from?**:

- **In the room**: "I can see the big screen". The phone shows the question's text, a small picture and the answer tiles; the video and the sound are on the projection, unless they reach **Every device**.
- **Remote**: "The question, its video and its sound come to this device".

**In the room** is preselected. In the console's **Players** tab, a remote player is marked with a wifi icon, "Participating remotely". Their avatar carries a wifi badge, on the console and on the projection's lobby, standings and podium.

A remote participant answers on the same clock as everyone else. The question's media is scheduled to start at the same moment on every device that plays it.

## Who hears what

Three settings decide which devices play the sounds and videos. The first one set applies:

1. A question's or slide's **Who hears this sound**, in the editor.
2. **Who hears the sound in this quiz**, in the lobby, for this room only. Questions with their own setting keep it.
3. The quiz's **Who hears the sound**, in the editor's settings.

| Choice | Big screen | Remote devices | Phones in the room |
|---|---|---|---|
| **Projection only** | plays | silent | silent |
| **Projection and remote participants** (default) | plays | play | silent |
| **Every device** | plays | play | play |

"Every device" makes phones in the room echo if they share it: keep it for players who are each in a different place.

The room's music and effects (see [Sound and projection](/docs/host/sound-and-projection/)) also reach remote participants, unless **Who hears the sound in this quiz** (or, when the lobby leaves it, the quiz's **Who hears the sound**) is set to the projection only. Phones in the room stay silent.

A browser plays sound only after a tap on the page. Remote players get a sound button on their device to turn it on, and can mute their own device at any time.

## A bigger screen at home

In the lobby, a player can choose **Share the projection** to open the big screen on a tablet or a computer: "the whole question, big". It gives a link and a QR code to scan with the other device; for a remote participant, that screen plays the sound too. The link carries the PIN, never the participant's seat: they keep answering on their phone.

Any player can also switch their phone between **Back to my answers** and **Show the big screen**.

## What to expect

- Answers are timed by the server when they arrive. QuizDock does not compensate for a slow connection: a player on a poor network loses a little time on each answer.
- Each device downloads the question's media itself. Before each question, the console waits for the devices to load it (10 seconds at most by default) and shows **Start anyway**.
- Phones in the room show a question's picture, and play its video only with **Every device**; remote devices play the video.

## Questions

### Can I run a quiz entirely remotely, with nobody in the room?

Yes. Share the PIN or the direct link by message, and ask everyone to choose **Remote** when they join: each one then gets the whole question on their own device. Choose **Projection and remote participants** or **Every device** for the sound.

### Does a remote player see the question before the others?

No. Devices receive the next question's picture, sound or video a few seconds ahead, never its text or its answers, and the answers open at the same time for everyone.

### Is it fair for players on a slow connection?

Partly. The question opens at the same moment for everyone, but the server times an answer when it arrives. A slow connection costs a little speed bonus; it does not change whether the answer is right.

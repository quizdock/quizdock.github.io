---
title: Troubleshooting for hosts
description: Fix the problems QuizDock hosts and players meet most often, from a PIN that does not work to a silent projector or a refused video.
sidebar:
  order: 15
---

Most problems in a room come from the network address, the browser's sound policy or a choice made in the lobby. Find the message or the symptom below; the sections after the tables cover the longer cases. When the cause is an instance setting, ask whoever runs your instance.

## Joining a room

| Symptom or message | Cause | Fix |
|---|---|---|
| "No open room with this PIN. Check the big screen." | A typo in the PIN, or the room is closed. | Check the 6 digits on the big screen. A closed room's PIN does not work again: open a new room. |
| "This room is closed to newcomers; a participant coming back still gets in." | You chose **Close the room to new participants**. | In the console, switch **Closed to newcomers** back to **Open to newcomers**. |
| "This nickname is already taken in this room." | Another player has it. | Pick another nickname. |
| "The nickname must be between 2 and 20 characters." | Too short or too long. | 2 to 20 characters. |
| "Too many wrong PINs from this address. Try again in a minute." | Too many wrong PINs from one network address within a minute. Phones on the same Wi-Fi often share one address. | Wait a minute, then type the PIN carefully, or share the QR code or the direct link instead. |
| Phones cannot open the address at all | The invitation address is `localhost`, or on a network the phones are not on, or a firewall blocks the port. | See [Phones cannot reach the room](#phones-cannot-reach-the-room). |
| Phones warn that the address is not secure | The instance is served over HTTPS and the invitation address is a local `http://` one. | Use the public address when there is one. |
| Players are asked to sign in | OIDC mode with **Accounts required**. | Players sign in, or choose **Open access** at the next launch if the instance allows it. |
| "You have been removed from the room." | The player was banned. | The ban ends after the time chosen (5 minutes by default). |

## During the game

| Symptom or message | Cause | Fix |
|---|---|---|
| No sound on the big screen | The browser allows sound only after a click in the projection window. | Click in the projection window and choose **Turn sound on**. See [No sound](#no-sound). |
| "Video started without sound (blocked by the browser)" | The same browser rule. | Click once in the projection window. |
| The console is silent | On purpose: the projection plays the sound. | Use **Hear "{name}" (here only)** in **Room sound** to check a sound. |
| "Loading the question’s media" lasts | Some devices are still loading the media. | Wait (10 seconds at most by default) or choose **Start anyway**. |
| "Your answer arrived too late: it is not counted." | The answer reached the server after the question closed (end of time plus 0.3 seconds). | Nothing to fix: late answers score 0. |
| "Too early: the answers were not open yet. Answer again." | The player answered during the reading time. | Answer again once the answers open. |
| "Quiz paused — host disconnected." | Your console lost the connection. | Reopen the room with **Resume** in **Open rooms** within 2 minutes. |
| Phones show no video | Phones in the room play a question's video only when its sound reaches **Every device**: otherwise the big screen does. | Players who cannot see the big screen choose **Remote** when they join. |

## Editing and presenting

| Symptom or message | Cause | Fix |
|---|---|---|
| "The quiz must be “ready” to be played (RG-02)." | The quiz is a draft. | Choose **Publish (ready)**. |
| "{n} steps are unfinished: complete them to publish the quiz." | Some questions or slides are incomplete. | Open each one from the checklist and finish it. |
| "This quiz is being played in a room: close the room first." | You tried to delete a quiz that a room is playing. | Close the room, then delete. |
| "Someone saved at the same time. Try again." | Two saves arrived together. | Save again. |
| "The host seat is held by someone else: you can only join rooms as a participant." | Local mode: another person holds the seat. | Wait for the seat to expire, ask the holder to release it, or ask an administrator to free it. |
| "This name does not hold the seat: only its holder signs back in." | The name typed is not the seat holder's. | Type the exact name used to take the seat. |
| "Host role required." | OIDC mode: your account has no host role. | Ask whoever runs your instance for the **Host** role. |

## Importing

| Message | Cause | Fix |
|---|---|---|
| "Not a QuizDock bundle (quiz.json + media/, zipped)." | The file cannot be read, or its structure is not QuizDock's: a `.zip` not made by QuizDock's **Export**, a `quiz.json` that is not JSON or misses a part. | Export the quiz again from QuizDock, or check the `quiz.json` against the format. |
| "Use the original Kahoot spreadsheet template (.xlsx), with one sheet." | The spreadsheet is not Kahoot's template. | Copy the questions into the official template, or use the chatbot conversion. |
| "No valid questions found. Check row 9 and the Kahoot template." | No row could be converted. | Check the rows from row 9 down. |
| "File too large to import (at most 50 MB)." | The file is over the instance's import limit. | Lighten the media, or ask whoever runs your instance. |

See [Import a quiz](/docs/host/import-a-quiz/).

## Phones cannot reach the room

1. Look at the invitation address in the console. `localhost` or `127.0.0.1` only works on the computer itself: choose another address under **Invitation address**.
2. On a local instance, pick the computer's address on the network the players use (an IP such as `192.168.x.x`, with the port of the page). When no local address was detected, **Why this address?** shows where to find it on Mac, Windows and Linux.
3. Check that the phones are on the same Wi-Fi as the computer. Guest Wi-Fi networks often keep devices apart.
4. Check that the computer's firewall lets the port through.
5. Test with your own phone: scan the QR code before players arrive.

The invitation address cannot change once the quiz has started. If no local address is listed, type it under **Other address…**; whoever runs your instance can make it appear. See [Networking](/docs/operator/networking/).

## No sound

1. Click once anywhere in the projection window, and choose **Turn sound on** if it shows. The click must be in that window, not in the console.
2. Open **Room sound** and check that **Projection sound** is on (the console shows **Room muted** when it is off) and that the **Media** level is up.
3. Check the question's **Who hears this sound**, and the lobby's **Who hears the sound in this quiz**.
4. Check the computer's volume and its sound output (HDMI, speakers).
5. Use Chrome or Edge for the projection.

## A media is refused

| Message | Fix |
|---|---|
| "QuickTime files (.mov) are not accepted." | A `.mov` reached the server without being converted. Upload it from the editor in Chrome or Edge, which converts it to MP4, or export it as MP4 (H.264) with HandBrake. |
| "Unsupported video codec (…)." | Often a video shot on an iPhone. Convert it to MP4 H.264 with HandBrake, or set the camera to "Most Compatible". |
| "This browser cannot convert this video to MP4 H.264." | Use Chrome or Edge, or convert it first with HandBrake. |
| "This browser cannot convert this sound to AAC." | Try Chrome or Edge, or convert it first with Audacity. |
| "File too large (at most 50 MB for this kind of media)." | Shorten or compress the file. The limit is the instance's. |
| "Too long to fit the 50 MB limit for this kind of media, even compressed." | Shorten the video first. |
| "Media uploads are disabled on the demo instance." | Uploads are off on the [live demo](https://quizdock-standalone.onrender.com). |

SVG pictures are not accepted: export them as PNG. See [Media](/docs/host/media/).

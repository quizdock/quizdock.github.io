---
title: Start a room and run the game
description: Open a QuizDock room from a ready quiz, set the lobby options, start the quiz, drive it from the console, chain several quizzes and close the room.
sidebar:
  order: 8
---

A room is a live game: one PIN, one console for you, one big screen, and the players' phones. This page covers opening a room, the choices to make before starting, driving the game, and closing it.

## Open a room

A quiz must be **Ready** to be played. On a draft, the dashboard shows **Publish to present** instead.

1. Choose **Present**, on the quiz in **My quizzes** or in the editor.
2. In OIDC mode, if the instance allows open access, a **Participant access** dialog asks how participants join:
   - **Accounts required**: each participant signs in. Personal tracking stays available.
   - **Open access**: the PIN and a nickname are enough, no account. No personal tracking.

   Tick **Remember my choice** to skip the question next time; change it later in **My account**, under **Participant access at launch**. The choice holds for as long as the room is open. Whether open access is allowed at all is an instance setting: ask whoever runs your instance (see [Settings](/docs/admin/settings/)).
3. The console opens on the lobby, with the room's PIN and the invitation in its centre. [Invite the players](/docs/host/invite-players/) and open the **Projection window** on the big screen.

A quiz can be played in several rooms at the same time.

## The console

The top of the console holds two rows, and the transport on the right:

- **First row**: the room's name and its quiz, the PIN, the number of players (it opens **Players**), the phase, and the views **Console**, **Projection** and **Participant**. In the lobby, the invitation fills the centre; once the quiz has started, choose the PIN to open it again.
- **Second row**: **Open to newcomers** (or **Closed to newcomers**), **Room sound**, **Animations**, and at its end **Projection window**.
- **Transport**: **Autoplay** and **Pause**, then **Change quiz** in the lobby or **Stop the quiz…** during a quiz, and **Close the room**.

Beside the current step, a column has two tabs: **Outline**, every step of the quiz, and **Players**. The bar at the bottom holds the action that moves on: **Start the quiz**, **Reveal answer**, **Show the standings**, **Show Q{n}**, **Show the slide** or **Show the podium**.

## Before starting

The lobby's **Before starting** section is fixed once the quiz starts:

- **Record all answers**: keeps each player's answer details, for individual tracking. Off by default. Players are told at the start. Turning it on keeps every answer with its nickname, which is personal data: tell the participants before you play.
- **Personalised tracking**: on by default. On, results are recorded under each participant (archived leaderboard, history). Off, no individual result is kept, only the group's overall results. Unavailable in open access.
- **Let participants pick their display name**: with accounts, off means the name shown comes from their account. Either way their results stay attached to the account: a chosen name is not anonymity.
- **Who hears the sound in this quiz**: replaces the quiz's setting for this room. Questions with their own setting keep it.
- **Language of the screens**: the language of the projection and the participants' screens, for the whole room. **Each quiz's language** (the default) follows the quiz being played; a language picked here holds for every quiz of the room, so a language class can play an English quiz with the interface in its own. Your console stays in your own [interface language](#interface-language).

Players see a notice on their phone that matches these choices, such as "Your individual results are not recorded — only the group’s overall results are."

You can also:

- **Rename the room**, in the lobby only (blank gives "{host}'s room");
- **Close the room to new participants**: nobody else can join, even with the PIN; those already in come back after a lost connection. This also works during the game;
- turn **Animations** off for a slow projector;
- set the room sound; see [Sound and projection](/docs/host/sound-and-projection/).

The lobby counts the players and who is ready ("Ready: 18 / 20 participants"). **Start the quiz** needs at least one player; wait until most are connected.

## Run the game

Each question opens on every device at the same time, after a short reading time (3 seconds by default, an instance setting). During the reading time the answers are not open yet: the clock stands at the question's time, in red, and the time bar runs red stripes. The clock starts counting when the answers open. The server keeps the clock: it opens and closes the answers, and the question closes as soon as every connected player has answered.

- **Autoplay**, a switch: off, you move on yourself; on, the game moves on by itself after each result. The answer stays on screen for the question's **Answer shown for**, the standings for the instance's time (5 seconds by default).
- **Pause** and **Resume**, also with the Space key. The clock stands still while paused, and the screens say **Paused**: "The clock stands still". The projection does not dim the question.
- **Reveal answer** closes the question early.
- After the reveal, **Show the standings** shows the quiz's leaderboard on every screen; the next action then moves on. There is no standings step after the last question, nor after a poll.
- **−5**, **−1**, **+1**, **+5** seconds adjust the time left during a question.
- The console's answer key is for you only.

When a question's media is still loading on some devices, the console waits for them and shows which ones are late; **Start anyway** goes on without them. The wait is limited (10 seconds by default).

### Look back at a played step

Between steps, or during a question you paused, you can show a played step again on every screen, read-only: nothing is replayed, no points change, and answers are refused meanwhile. In **Outline**, use the arrows (**Look back at the previous step**, **Look at the next played step**) or choose a played step in the list. **Back to live** returns. From a paused question, **Resume** also brings the question back and runs its clock again.

### Players and live standings

The **Players** tab lists the participants as live standings:

| Column | What it shows |
|---|---|
| **#** | The rank: in this quiz once someone has scored, in arrival order before. |
| **Participant** | The avatar and the nickname. |
| Ready (✓) | In the lobby, whether the participant is ready. Before a question with media, whether their device has loaded it. |
| Remote (wifi) | Whether the participant plays remotely ("Participating remotely"). |
| **Quiz** | The score in this quiz. |
| **Total** | The score in the room, over its quizzes. |

Click a column's header to sort by it, and again to reverse the order. In the lobby, a ready participant's avatar is ringed green. A remote participant's avatar carries a wifi badge, on the console and on the projection's lobby, standings and podium.

To remove a player, choose **Ban {nickname}** on their row. The ban lasts from 1 to 1440 minutes, 5 by default; the player cannot come back with that nickname for that time.

## Several quizzes in one room

A room can play several quizzes in a row. The participants stay in it, and nobody types the PIN again.

- At the podium, **Back to the lobby** takes the room back to its lobby. **Archive this quiz's results** is ticked by default.
- During a quiz, **Stop the quiz…** stops it here and takes the room back to its lobby. **Keep what was played so far** is ticked by default: the quiz is archived as interrupted and counted in the room's standings.
- In the lobby, before the quiz starts, **Change quiz** replaces the quiz picked.

Back in its lobby, the room shows its standings so far, and the console offers **Choose the quiz**. The picker lists your ready quizzes; once the room has played one, **Played in this room** filters them (**All quizzes**, **Not played yet**, **Already played**). **Open this quiz** brings it into the room's lobby.

The next quiz starts on its own: after 30 seconds ("Starts in 30 s", on the console and on the projection), or as soon as every connected participant is ready. **Stop the countdown** stops it; the quiz then waits for **Start the quiz**. Meanwhile the projection shows the invitation and, beside it, the room's standings. On the phones, the feedback card of the lobby is about the quiz just played: "Your feedback on the previous quiz".

Each quiz scores from zero; **Room standings** and the **Room podium** add the quizzes up.

## Interface language

Your own screens (**My quizzes**, the editor, the console) are in your **Interface language**, chosen under **My account**, **Preferences**. **The instance's** language is the default. The projection and the participants' screens follow the room's **Language of the screens**, or else the quiz's language.

## Close the room

**Close the room** ends it for good: the PIN is invalidated and the participants are disconnected. During a quiz or at the podium, **Archive this quiz's results** is ticked by default: the leaderboard and statistics then stay available in [History](/docs/host/reports-and-history/).

**My quizzes** lists your **Open rooms**, with **Resume** to go back to the console and **Close the room…** to end one.

## If you lose the connection

Close the console by accident, or lose the network, and the game waits for you. After 5 seconds the quiz pauses ("Quiz paused — host disconnected.") and the players see "Waiting for the host…". Come back within 2 minutes, with **Resume** in **Open rooms**, and the game picks up with the time that was left. After 2 minutes the room ends, and what was played is archived as **Interrupted**.

## Questions

### How many players can join a room?

QuizDock sets no cap on players per room. The limit is the server's: in a load test on 2026-09-27 (backend on one 2.1 GHz core, simulated players on the same machine over loopback, no media), one room of 1500 players kept every answer. See [Real-time](/real-time/) for the conditions and the numbers.

### Can I change "Record all answers" once the quiz has started?

No. The options under **Before starting** are fixed once the quiz starts.

### Can players join after the start?

Yes, unless you choose **Close the room to new participants**. A player who joins late has no points for the questions already played.

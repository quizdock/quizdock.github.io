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
3. The console opens on the lobby, with the room's PIN. [Invite the players](/docs/host/invite-players/) and open the **Projection window** on the big screen.

A quiz can be played in several rooms at the same time.

## Before starting

The lobby's **Before starting** section is fixed once the quiz starts:

- **Record all answers**: keeps each player's answer details, for individual tracking. Off by default. Players are told at the start. Turning it on keeps every answer with its nickname, which is personal data: tell the participants before you play.
- **Personalised tracking**: on by default. On, results are recorded under each participant (archived leaderboard, history). Off, no individual result is kept, only the group's overall results. Unavailable in open access.
- **Let participants pick their display name**: with accounts, off means the name shown comes from their account. Either way their results stay attached to the account: a chosen name is not anonymity.
- **Who hears the sound in this quiz**: replaces the quiz's setting for this room. Questions with their own setting keep it.

Players see a notice on their phone that matches these choices, such as "Your individual results are not recorded — only the group’s overall results are."

You can also:

- **Rename the room**, in the lobby only (blank gives "{host}'s room");
- **Close the room to new participants**: nobody else can join, even with the PIN; those already in come back after a lost connection. This also works during the game;
- turn **Animations** off for a slow projector;
- set the room sound; see [Sound and projection](/docs/host/sound-and-projection/).

The lobby counts the players and who is ready ("Ready: 18 / 20 participants"). **Start the quiz** needs at least one player; wait until most are connected.

## Run the game

Each question opens on every device at the same time, after a short reading time (3 seconds by default, an instance setting). The server keeps the clock: it opens and closes the answers, and the question closes as soon as every connected player has answered.

- **Autoplay**, a switch: off, you move on yourself; on, the next question comes after each result, with the reveal delay set per question.
- **Pause** and **Resume**, also with the Space key. The clock stands still while paused.
- **Reveal answer** closes the question early; **Next question** moves on from the reveal.
- **−5**, **−1**, **+1**, **+5** seconds adjust the time left during a question.
- **Look back at the previous step** shows a played step again on every screen, read-only: nothing is replayed and no points change. **Back to live** returns.
- The console's answer key is for you only.

To remove a player, open **Players** and choose **Ban {nickname}**. The ban lasts from 1 to 1440 minutes, 5 by default; the player cannot come back with that nickname for that time.

When a question's media is still loading on some devices, the console waits for them and shows which ones are late; **Start anyway** goes on without them. The wait is limited (10 seconds by default).

## Several quizzes in one room

The players can stay in the room for more than one quiz:

- **Next quiz**, after the podium: play another quiz; the participants meet again in its lobby, and nobody types the PIN again.
- **Change quiz**, before it starts: replace the quiz picked.
- **End quiz…**, during a quiz: stop it here and pick another. **Keep what was played so far** archives it as interrupted and counts it in the room's standings.

The picker lists your ready quizzes, with **Played in this room**, **Not played yet** and **Already played**. Each quiz scores from zero; **Room standings** and the **Room podium** add the quizzes up.

## Close the room

**Close the room** closes it for good: the PIN is invalidated and the participants are disconnected. **Archive this quiz's results** is ticked by default: the leaderboard and statistics then stay available in [History](/docs/host/reports-and-history/).

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

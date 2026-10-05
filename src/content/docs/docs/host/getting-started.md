---
title: Get started as a host
description: Sign in to a QuizDock instance as a host, in local mode or with an identity provider, take a sample quiz and play your first game.
sidebar:
  order: 1
---

Here, the host is the **quiz host**: the person who presents the quiz to the room. This page takes you from the sign-in screen to your first game. It assumes someone has already installed QuizDock and given you its address. To try QuizDock without installing anything, open the [live demo](https://quizdock-standalone.onrender.com): it shares one host account between every visitor, has media uploads turned off and is wiped every hour.

## Sign in

How you sign in depends on how the instance was set up. The sign-in page shows which mode you are in.

### Local mode: the host seat

In local mode there are no accounts. One person at a time holds the **host seat**, and everyone else joins rooms with a PIN.

1. Open the instance and choose **Host area**.
2. The page shows **Seat free** and **One host at a time here**, or **Held by {name}** when someone else holds it.
3. Type **Your name**.
4. In **Keep the seat**, choose how long the seat stays yours: **After 1 hour**, **After 4 hours** (the default), **After 24 hours** or **Never (until I log out)**.
5. Choose **Take the host seat**.

Your name is your key: typing the same name again, on any device, brings you back as host with **Sign back in**. Anyone who types it gets the seat too, so local mode belongs on a network you trust.

While you hold the seat, its remaining time shows next to your name. You can **Extend the seat for** another period, or **Release the seat** to give it back (you stay signed in as a participant, and **Undo** takes it back). The seat is also released when you choose **Log out** or when it expires. When someone else holds the seat, the sign-in page offers **Join a room as a participant** instead.

### OIDC mode: sign in with your organisation

In OIDC mode, choose **Sign in** and sign in with your organisation's identity provider. To create and present quizzes, your account needs the **Host** role. There is no seat: any number of hosts can work at the same time.

The role comes from your identity provider, or an administrator of the instance grants it. If you sign in and cannot create a quiz, ask whoever runs your instance for the host role. Participants also sign in before joining, unless the instance allows open access and you choose it when you launch the room (see [Start a room](/docs/host/start-a-room/)).

## Roles

**My account** shows your roles:

| Role | What it lets you do |
|---|---|
| **Participant** | Join rooms with a PIN. |
| **Host** | Your own bank: create, edit and present quizzes, and share templates. |
| **Manager** | Read the whole instance and administer it. |

Managing is not hosting: a manager without the **Host** role cannot create, edit or present quizzes. A role cannot be changed from **My account**; see [Accounts and roles](/docs/admin/accounts-and-roles/) for how administrators grant them.

Under **Preferences**, **My account** also sets your **Interface language**: the language of your own screens. See [Start a room](/docs/host/start-a-room/#interface-language).

The navigation shows **My quizzes**, **Templates**, **My account**, **Administration** (for managers only) and **Log out**.

## Start from a sample quiz

QuizDock ships three sample quizzes in English: **Discover France**, **Discover Taiwan** and **Discover Türkiye**. Each one uses every question type, with pictures and slides, and every media is credited. They live in **Templates**.

1. Open **Templates** (or, on an empty bank, **Browse the templates**).
2. Open one of the samples and choose **Create a quiz from this**.
3. An independent copy lands in **My quizzes** as a draft. Choose **Publish (ready)**, then **Present**, or change it first.

An administrator can also add the sample quizzes directly to an account's bank from the administration.

## From your first quiz to your first game

1. In **My quizzes**, choose **New quiz**. A draft opens with an intro slide and a first question.
2. Write your questions. See [Create a quiz](/docs/host/create-a-quiz/) and [Question types](/docs/host/question-types/).
3. Choose **Publish (ready)**. A quiz must be ready to be played.
4. Choose **Present**. A room opens with a 6-digit PIN.
5. Choose **Projection window** and move it to the big screen.
6. Players open the address shown on the screen, or scan the QR code, type the PIN and a nickname. See [Invite players](/docs/host/invite-players/).
7. When the players are in, choose **Start the quiz**.

For a first test on your own, join from your phone, or from a private window of another browser, as a player.

## Questions

### Can two people host at the same time in local mode?

No. Local mode has one host seat. Others can join rooms as participants. With an identity provider (OIDC mode) there is no seat and no limit on the number of hosts.

### Is the host seat a security boundary?

No. Anyone who types the seat holder's name gets the seat. Use local mode on a network you trust; for named accounts, the instance needs an identity provider. See [Configure an identity provider](/docs/operator/oidc/).

### Why can't I present, even though I can see the administration?

The **Manager** role administers the instance; it does not include hosting. Ask for the **Host** role as well.

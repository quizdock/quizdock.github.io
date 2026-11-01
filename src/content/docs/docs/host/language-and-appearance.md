---
title: Language and appearance
description: Pick the language of the QuizDock interface, with or without an account, which language the big screen and the phones speak, and light or dark mode.
sidebar:
  order: 17
---

Anyone may pick the language of their own interface, and whether it is light or dark. This page holds for hosts, administrators and players alike.

## Interface language

QuizDock speaks English, French, Spanish, Chinese (simplified and traditional), Turkish, German, Hindi, Italian, Japanese, Polish and Russian. The instance's language (`APP_LANG`, see [Branding](/docs/admin/branding/)) is the default for everyone; a browser's own language is not used.

| Who | Where to pick it | Kept |
|---|---|---|
| Signed in | The account menu (your name, at the top right) → **Language**, or **My account** → **Interface language**. **The instance's ({language})** goes back to the default. | In your account, on every device you sign in on. |
| Without an account | The globe in the top bar. | On this device. |

In a game:

| Screen | Speaks |
|---|---|
| The console, the editor, the lists | Your language. The console's **Projection** and **Participant** views speak the lobby's, as the screens they show. |
| The projection | The lobby's **Language of the screens**, by default the language of the quiz being played. See [Start a lobby](/docs/host/start-a-room/#before-starting). |
| A player's phone | The language the player picked, else the lobby's. |

A quiz's own text is never translated: it is in the language its author wrote it in.

## Appearance

The account menu's **Appearance** sets this device's interface: **As the system**, **Light** or **Dark**. It is kept on the device, not in the account.

An administrator may force light or dark for the whole instance (see [Branding](/docs/admin/branding/#interface)); **Appearance** is then gone from the menu.

The live screens are never dark on their own account: the projection and the phones wear the [quiz's theme](/docs/host/quiz-themes/).

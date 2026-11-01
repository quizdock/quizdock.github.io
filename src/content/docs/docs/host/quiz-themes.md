---
title: Quiz themes
description: Give a QuizDock quiz its look on the big screen and the phones, pick a shipped theme or make your own, and export or import a theme.
sidebar:
  order: 5
---

A theme is the look of a quiz on the live screens: the projection and the players' phones, from the lobby to the podium. It sets the background, the answers' colours and icons, the font, the effects and the motion. Your own screens (the console, the editor, the lists) keep the instance's look; see [Branding](/docs/admin/branding/).

## Pick a quiz's theme

In the editor's settings, open **Theme** and choose a thumbnail:

- **Instance default ({name})**: the theme an administrator set for the instance, Classic unless they changed it. A new quiz starts here.
- a theme shipped with QuizDock;
- a theme made by a host of your instance.

The previews of the quiz (the preview page, the question and slide forms, the cards) show it. An accessible theme says so (below). **Manage themes…** opens the themes.

## The themes

**Quizzes** has four tabs: **My quizzes**, **Selections**, **Templates** and **Themes**. **Themes** lists the shipped themes first, then **Made by the hosts**, as cards or a list. Its bar is the other tabs': **Search by name**, **Owner** (when the hosts' themes have more than one owner), **Sort by** (**Recently updated**, **Title (A–Z)**) and the display. **Accessible only**, under the search, keeps the accessible themes.

| Shipped theme | What it is |
|---|---|
| **Classic** | QuizDock's settled colours and animal icons. The default. |
| **Sober**, **Kids**, **Festive** | Classic's answers in another mood: background, accent, font, motion. |
| **Night** | Classic's colours on a dark background. |
| **High contrast**, **High contrast light** | The accessible ones. |
| **Halloween**, **Christmas**, **New year**, **Easter**, **Summer** | Seasonal: a picture, their season's icons, their own colours. |

Every host may use every theme. Only its owner and the administrators change or delete a host's theme; to anyone else it opens read-only.

A shipped theme opens read-only, with its preview. **New theme from it** creates "My {theme}" and opens it in the editor, where you rename it in place. On a host's theme, **New theme from it** makes your own copy.

**New theme** offers:

| Choice | What it does |
|---|---|
| **Blank theme** | A new theme from Classic. |
| **From a shipped theme…** | Takes you to the shipped themes: choose **New theme from it** on one. |
| **Import a file…** | Imports a theme file (below). |

A card's menu holds **Export** and **Delete**. A theme used by a quiz, or the instance's default, cannot be deleted: the menu says why.

## The editor

A theme stores only what it changes. The rest follows the shipped theme it comes from: a part you have not touched says **From {theme}**, a changed one offers **Changed · back to {theme}**. Every change is saved as you make it.

| Part | What you set |
|---|---|
| **Background** | A **Colour**, a **Gradient** or a **Picture** (one of your own, or a shipped seasonal one), with **Light text** or **Dark text**. A picture is laid as a **Watermark**, **Cover** (with a **Veil**), **Whole** or a **Pattern**, with its size, opacity, blur and greyscale. |
| **Answers** | The colour of each of the eight answers, and its icon: **Icon…** picks one from the bank (animals, food, sports, seasons…, with a search), **Choose a set of eight…** gives all eight at once, **Upload an SVG…** takes your own (square, single colour). **Marked by**: **Icons**, **Letters A–H** or **Numbers 1–8**. Text and icons on the answers are always white. |
| **Accent** | The standings' bars, the "ready" and "you" marks. |
| **Font** | One of the shipped fonts, or **Import a font (.woff2)…** with its licence (OFL 1.1, CC0, CC BY or CC BY-SA). |
| **Effects** | **Answer received**, **Last seconds**, **Countdown** and **Time up**: built-in or an effect of the theme. An effect you pick for the lobby in **Lobby audio** still wins. |
| **Motion** | **Standard**, **Sober**, **Dynamic** or **Festive**, and confetti for the players who found the answer. The lobby's **Animations** switch and a device's reduced motion always win. |
| **Licence** | **No licence**, CC0, CC BY or CC BY-SA: the terms others may reuse the theme under. You must hold the rights to its pictures, icons, effects and font. |

The preview beside the editor shows the projection and the phone, or one of them, at four moments: **Lobby**, **Question**, **Answer** and **Podium**.

A step with its own background keeps it; the others, the lobby and the podium take the theme's. See [Slides](/docs/host/slides/#background-and-contrast).

## Accessibility

**Accessibility** measures the theme's colours as you edit it, and lists each check:

- the white text on each answer reaches 4.5:1;
- the question's text reaches 4.5:1 on the background, the answers and the accent 3:1;
- the eight answer colours look different, the first four for colour-blind players too;
- the eight icons are different.

Only a theme that passes every check carries the **Accessible** badge, in the themes and in the quiz settings. The others carry nothing. A projector shows colours its own way: the checks are guides and block nothing.

## Export and import a theme

- **Export**, in a host's theme's menu, downloads a `.quizdock-theme.zip` file: the theme and its files.
- **New theme → Import a file…** adds such a file to the themes, as yours. When the same theme is already there, it is used instead of a copy.

A quiz's own [export](/docs/host/import-a-quiz/#move-a-quiz-with-a-bundle) carries its theme too. On import, a theme the instance cannot use gives the quiz the shipped theme it comes from, or the instance's default; the import says so.

## During a game

A game takes the quiz's theme when the lobby opens it, and keeps it until the end: a change to the theme shows from the next game, never during one.

## The instance's default

An administrator chooses **Make it the instance's default** in a theme's menu. Every quiz on **Instance default** takes it, from its next game.

---
title: Quick setup
description: The three quick-setup questions of QuizDock (Internet, audience, accessibility), exactly which settings each answer sets, and how to apply them from the command line.
sidebar:
  order: 7
---

The quick setup asks three questions in plain words. Each answer sets several [settings](/docs/admin/settings/) at once. The setup wizard asks them at its **Usage** step; after the setup, they are applied from the command line.

## The questions and what each answer sets

The standard answer of each question equals the defaults: choosing it on a new instance changes nothing.

### Does this instance reach the Internet?

| Answer | `UPDATE_CHECK` | `MEDIA_LIBRARY_LINKS` |
|---|---|---|
| **Yes** (`connected`, standard): "The editor offers free media libraries online." | `true` | the seven default libraries |
| **No** (`offline`): "A local network only: no links to online libraries." | `false` | `none` |

With **No**, the administration no longer asks GitHub for new releases, and the editor shows no links to online media libraries. See [Air-gapped](/docs/operator/air-gapped/) for the rest of an instance without Internet.

### Who plays?

| Answer | `ALLOW_ANONYMOUS_PARTICIPANTS` | `GAME_MEDIA_WAIT_S` |
|---|---|---|
| **Colleagues, friends** (`colleagues`, standard): "The standard settings." | `false` | `10` |
| **A class, a training** (`class`): "Participants sign in with their account." | `false` | `10` |
| **The public, a large event** (`public`): "Open to all — with an identity provider — and more time for sounds and videos to load on a busy Wi-Fi." | `true` | `20` |
| **A bit of everything, other** (wizard only): "Nothing is changed: set what you need at the next steps." | unchanged | unchanged |

`ALLOW_ANONYMOUS_PARTICIPANTS` applies in OIDC mode only. In local mode the quick setup leaves it alone ("left alone: only with an identity provider (AUTH_MODE=oidc)"), since participants there join with the PIN and a nickname anyway. `GAME_MEDIA_WAIT_S` is how long a room waits, at most, for the devices to load a question's sound or video.

### Do some participants need it easier?

| Answer | `GAME_READ_DELAY_MS` | `GAME_ALL_ANSWERED_DELAY_MS` | `LIVE_MOTION` |
|---|---|---|---|
| **No** (`standard`): "The standard settings." | `3000` | `1000` | `on` |
| **Yes** (`adapted`): "No transitions, more time to read." | `6000` | `2000` | `off` |

`GAME_READ_DELAY_MS` is the reading time before a question's timer starts. `GAME_ALL_ANSWERED_DELAY_MS` is the pause once everyone answered, before the answer is revealed. `LIVE_MOTION` turns the transitions of the live screens on or off for new rooms; a host can still switch them for their room. See [Accessibility](/accessibility/).

## In the setup wizard

1. Answer the three questions.
2. The wizard shows "What these answers set:", setting by setting, with the value each replaces.
3. **Apply**. "Applied: the next steps show it."

Every value can still be adjusted at the next steps, or later in [Settings](/docs/admin/settings/).

## From the command line

After the setup, the quick setup is applied from a shell. On the server, in the instance's folder:

```sh
./quizdock qd presets.list
```

lists the questions, their answers, the settings each one sets, and the instance's current answer to each (`custom` once a setting differs from every answer).

```sh
./quizdock qd presets.plan --internet=offline
```

shows what an answer would change, setting by setting, without changing anything.

```sh
./quizdock qd presets.apply --internet=offline
```

applies it. Give one or more answers: `--internet=connected|offline`, `--audience=colleagues|class|public`, `--accessibility=standard|adapted`. `--dry-run` previews. An answer that changes a level C2 setting (open access) asks for a confirmation: add `--yes` when no one is at the terminal.

```sh
./quizdock qd presets.apply --audience=public --accessibility=adapted --yes
```

## Same checks, same audit

The quick setup is a shortcut, not a separate mechanism. Its values are changes made from the administration, like any other:

- they are checked like any change, and win over `.env` in the same way;
- all the settings of a plan are applied together, or none;
- from the web, a setting named in `ADMIN_LOCK` is left alone ("left alone: locked by ADMIN_LOCK"); the command line is not concerned by `ADMIN_LOCK`;
- the change is recorded in the [audit](/docs/admin/audit/), with the value each setting had before, and shows in each setting's own history (`qd audit.list --setting=KEY`);
- **Back to .env** or **Take everything back** in [Settings](/docs/admin/settings/) undoes it.

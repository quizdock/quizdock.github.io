---
title: Accounts and roles
description: The host and admin roles, how an account gets them in local mode and in OIDC mode, granting and revoking them, the host seat, and open access for participants.
sidebar:
  order: 2
---

This page explains who may host, who may administer, and who may take part, and how an administrator changes it from **Administration → Accounts** or from the command line.

## The roles

An account holds a set of roles. An account with no role is a participant.

| Role | In the app | What it allows |
|---|---|---|
| none | "Participant" | Join rooms with a PIN. |
| `host` | "Host" | Its own bank: create, edit and present quizzes, share templates. |
| `admin` | "Administrator" ("Manager" under **My account**) | Read the whole instance and administer it. On its own, it creates, edits and presents nothing, and does not take the host seat. |

The two roles add up: `host,admin` is the usual account of the person who runs a small instance, with the whole instance to administer and a bank of their own.

## How an account gets a role

A role is either **derived** from the context, on every request, or **granted** by an administrator. The account holds both together.

| Mode | Derived | Granted |
|---|---|---|
| Local mode (`AUTH_MODE=none`) | `host` by taking the host seat: one host at a time. | `host`, `admin` or both, from the administration or `qd user:set-role`. No seat needed. |
| OIDC mode | The roles in the token, under the claim `OIDC_ROLES_CLAIM` points at (`roles` by default; for example `realm_access.roles` with Keycloak). Any number of hosts. | The same. |

A grant stays: an expired seat or a token that no longer carries the role does not lower it. Revoking the grant lets the derived roles apply again on the next request.

The first administrator comes from the setup wizard ([Administration overview](/docs/admin/overview/#the-setup-of-a-new-instance)): in local mode, the name given at the **Access** step; in OIDC mode, the identity provider.

## Accounts in the administration

**Administration → Accounts** lists the accounts, 25 to a page:

- search by name, subject or e-mail, and filter by role;
- each account's roles, number of quizzes, games hosted and creation date;
- "Granted from the administration" marks a role granted here or with `qd`.

An account appears once its owner has signed in at least once. Its **subject** identifies it: the OIDC `sub`, or `local:<name>` in local mode (the name in lower case, without accents, other characters turned into hyphens: "Alice Martin" is `local:alice-martin`).

### Grant or revoke a role

From the web, this needs `ADMIN_WEB_SCOPE=write` (and the administration token in local mode).

1. Open the account's actions, then **Grant or revoke a role…**.
2. Tick or untick **Host** ("Creates quizzes and hosts games.") and **Administrator** ("Reaches the administration.").
3. **Save**. A change to the administrator role asks for a confirmation.

The dialog changes only what the administration grants. A role the identity provider gives stays, whatever is ticked: remove it in the provider.

The last administrator of the instance cannot lose the role from the web: "The last administrator cannot lose the role." Grant it to someone else first.

From the command line, on the server, in the instance's folder:

```sh
./quizdock user:list                                # subjects, roles, grants
./quizdock user:set-role local:alice host           # or admin, or host,admin
./quizdock user:set-role ada@example.org player     # revokes every grant
```

The command line is never limited by `ADMIN_WEB_SCOPE`, and it records its changes in the [audit](/docs/admin/audit/) too.

## The host seat (local mode)

Local mode has no identity provider. A host types a name and takes the **host seat**, with an optional expiry (1 h, 4 h, 24 h or none). While the seat is held, everyone else can only join rooms as a participant. It is freed when its holder logs out, or once its expiry is past.

The name is the only key: typing the holder's name again, on any device, resumes the seat. That is why local mode is for trusted networks, and why the web administration needs `ADMIN_TOKEN` there.

**Administration → Accounts** shows who holds the seat and since when ("Held by Alice, since …"), or "Free: the next one to claim it hosts." **Free the seat** frees it, whoever holds it: for a seat claimed with no expiry by someone who left. This needs `ADMIN_WEB_SCOPE=write` and the token.

From the command line:

```sh
./quizdock seat:status
./quizdock seat:release
```

An account granted `host` does not need the seat, and others can still take the seat for themselves.

## Who may take part

In local mode, the PIN is the only barrier: a participant types it, then a nickname.

In OIDC mode, there are two barriers. The account opens the application; the PIN opens one room. So every participant signs in by default, and their results are attached to their account.

### Open access (OIDC mode)

Some rooms have no accounts to give: trainees who change every session, visitors at an event. Set `ALLOW_ANONYMOUS_PARTICIPANTS` to `true` and each launch asks the host how participants get in, for as long as the room is open:

- **Accounts required**: "Each participant signs in. Personal tracking stays available."
- **Open access**: "The PIN and a nickname are enough, no account. No personal tracking."

A host can skip the question from then on; the choice is kept with their account, under **My account → Preferences → Participant access at launch**.

`ALLOW_ANONYMOUS_PARTICIPANTS` is a level C2 setting: it can be changed from **Administration → Settings** (with `ADMIN_WEB_SCOPE=write`, confirmed), or set by the "The public, a large event" answer of the [quick setup](/docs/admin/presets/). It does nothing in local mode. Until it is on, every game requires accounts.

Whatever the access, the host can close a room to new participants and remove one, and each address may try 30 wrong PINs a minute.

## Questions

### Can I delete an account?

No. QuizDock has no account deletion or anonymisation yet. See [Privacy and retention](/docs/admin/privacy-and-retention/).

### Someone left. What happens to their quizzes?

They stay with their account. If the account no longer has the host role, its quizzes show as "Owner can no longer reach it" in **Administration → Quizzes**: [hand them over](/docs/admin/quizzes/#hand-a-quiz-over) to another account.

### Why does my account show "Manager" under My account?

It is the same `admin` role. **My account** explains it: "You read the whole instance and administer it. Managing is not hosting: creating, editing and presenting belong to hosts." Add the `host` role to present quizzes too.

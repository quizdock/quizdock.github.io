---
title: Troubleshooting the administration
description: "Problems in the QuizDock administration, from what you see to what to do: reaching it, changing a setting, the setup wizard, accounts, media."
sidebar:
  order: 12
---

Each entry gives what you see, why, and what to do. Many fixes are in the instance's `.env` file, followed by a restart: that is done on the server, by whoever runs the instance ([Configuration](/docs/operator/configuration/)). For the server itself (start-up, database, sign-in with the identity provider), see the [operator troubleshooting](/docs/operator/troubleshooting/).

## Reaching the administration

### There is no "Administration" in the top bar, or "This page is for the instance's administrators."

**Cause.** The account does not hold the admin role.

**Fix.**

- OIDC mode: give the account the `admin` role in the identity provider, under the claim `OIDC_ROLES_CLAIM` points at, then sign in again. Or grant it, on the server, in the instance's folder: `./quizdock user:set-role ada@example.org admin`. The account must have signed in once.
- Local mode: sign in with the exact name of the first administrator given in the setup wizard. Or grant the role: `./quizdock user:set-role local:alice admin` (`./quizdock user:list` shows the subjects).

See [Accounts and roles](/docs/admin/accounts-and-roles/).

## Changing a setting

The top of **Administration → Settings** says why the page is read-only, and each row says why it is.

| The page or the row says | Cause | Fix |
|---|---|---|
| "Read only (ADMIN_WEB_SCOPE=read)" | The default scope: the web changes nothing in the Instance domain. | In `.env`: `ADMIN_WEB_SCOPE=write`, then restart. |
| "Critical: never from the web" | A level C1 setting (or an internal one). | Change it in `.env`, then restart. |
| "Locked by ADMIN_LOCK" | The operator named it in `ADMIN_LOCK`. | Remove it from `ADMIN_LOCK` in `.env` and restart, or change it from a shell: `./quizdock qd settings.set --key=… --value=…`. |
| "Safe mode" | `ADMIN_OVERRIDES=ignore` is in `.env`: the values changed here are kept but not applied. | Remove the line from `.env` and restart. See [Settings](/docs/admin/settings/#safe-mode). |
| "Local mode: nothing can be changed from the web until ADMIN_TOKEN is set." | Local mode, and no token in `.env`, or one shorter than 32 characters (ignored, as if unset; `./quizdock doctor` reports it). | In `.env`: `ADMIN_TOKEN=` followed by 32 characters or more, then restart. |
| "Local mode: a change needs the administration token." | The token is set but not given in this tab. | Enter it in the box at the top of the administration, then **Use**. It is kept in this tab only. |

### "Local mode: give the administration token (ADMIN_TOKEN) to change anything." after giving it

**Cause.** The token typed does not match `ADMIN_TOKEN`.

**Fix.** **Forget it**, then type it again, without spaces around it. The operator can read it in `.env`.

### "Too many attempts: wait a moment."

**Cause.** Ten wrong administration tokens from one address, or fifty from all addresses together, in a quarter of an hour. Or more than 120 operations a minute from one account.

**Fix.** Wait a quarter of an hour for the tokens, a minute for the pace.

### A value is refused when saving

**Cause.** It is outside what the setting accepts ("Accepts …"), or it contradicts another setting. A value changed here is checked strictly against the setting's range, where a value in `.env` out of range is only reported.

**Fix.** Use a value within the range shown in the setting's help. An empty value is refused: use **Back to .env** instead.

### Saved, but nothing changed

**Cause.** Most settings apply on their next use; some apply only to rooms opened after the change ("Next room"), such as `LIVE_MOTION`. A room already open keeps its own.

**Fix.** Open a new room. If the row's **Source** is not "Changed here", the change did not go through: look at the [audit](/docs/admin/audit/).

### A change in `.env` has no effect

**Cause.** `.env` is read when the instance starts: a change there needs a restart. Or the same setting was changed from the administration, and that value wins (default < `.env` < administration).

**Fix.** Restart the instance. If the row's **Source** says "Changed here", use **Back to .env** on the row.

### "The confirmation expired: try again."

**Cause.** A confirmation is valid five minutes, for the same operation and parameters.

**Fix.** Run the operation again and confirm within five minutes.

### "The operation took too long."

**Cause.** The operation passed its time. It goes on in the background.

**Fix.** Do not run it again at once. Its real outcome joins the [audit](/docs/admin/audit/), marked `late`: check it first.

## The setup wizard

### "This setup token is not valid (wrong, used or expired)"

**Cause.** The token works only once and expires 24 hours after it was created. A newer token also replaces it: the previous one stops working.

**Fix.** Get a new one, on the server, in the instance's folder, and give it at once:

```sh
./quizdock qd setup.token
```

### "Too many wrong tokens: wait a quarter of an hour."

**Cause.** A hundred wrong setup tokens in a quarter of an hour, from all addresses together.

**Fix.** Wait, or get a new token with `./quizdock qd setup.token`: it lifts the wait.

### "The setup session ended: give a new setup token."

**Cause.** The wizard's session lasts two hours. It also ends when the setup is finished or reopened.

**Fix.** Give a new token (`./quizdock qd setup.token`).

### "This instance is set up: the wizard is closed"

**Cause.** The setup was finished, skipped with `qd setup.complete`, or the instance already had accounts when it was upgraded.

**Fix.** Everything the wizard sets is in **Administration → Settings**. To run the wizard again: `./quizdock qd setup.reopen`, which gives a new token.

### OIDC mode: the wizard asks to sign in, or refuses to finish

**Cause.** With an identity provider, the wizard needs a signed-in account, and finishing it needs the admin role.

**Fix.** Sign in. Give your account the `admin` role in the provider, or grant it with `./quizdock user:set-role <sub|email> admin`.

### "A blocking problem above: fix it (in .env, then restart), check again, and the wizard goes on."

**Cause.** A health check failed: database, Redis, migrations, folders or a critical variable.

**Fix.** The message of the failed check says what to fix, in `.env` or the infrastructure. Restart, then **Check again**. See [Health](/docs/admin/health/).

## Accounts and roles

### "Not possible right now: The last administrator cannot lose the role."

**Cause.** The web keeps at least one administrator.

**Fix.** Grant the role to another account first.

### A role cannot be unticked

**Cause.** The role comes from the identity provider: the administration only changes what it granted.

**Fix.** Remove the role in the provider.

### Someone cannot be found to hand a quiz over, or to grant a role

**Cause.** An account exists once its owner has signed in.

**Fix.** Ask them to sign in once, then search again by name, subject or e-mail.

## Quizzes and media

### **Hand over** or **Delete** is greyed out

**Cause.** The quiz is being played: "Being played (PIN …)".

**Fix.** Wait for the room to close.

### A file cannot be deleted

**Cause.** "A room is playing it: it cannot be deleted until the room closes."

**Fix.** Wait for the room to close.

### The clean-up deletes nothing

**Cause.** An unused media waits a day before it is deleted ("still within its day of grace"). Or the clean-up stopped itself because the database and the media volume do not match.

**Fix.** Wait for the day to pass, or read the message on the **Clean-up** card. A mismatch usually means the database and the media were not restored from the same backup: see [Restore](/docs/operator/restore/).

### Uploads are refused above a few megabytes

**Cause.** The media limits, or the body size limit of a reverse proxy in front of the instance.

**Fix.** Check `MEDIA_MAX_BYTES`, `MEDIA_MAX_VIDEO_MB`, `MEDIA_MAX_AUDIO_MB` and `IMPORT_MAX_BYTES` in [Settings](/docs/admin/settings/). If they are high enough, the proxy's limit must be raised: see [Reverse proxy](/docs/operator/reverse-proxy/).

## Statistics and version

### A game is missing from the statistics

**Cause.** The history counts archived games only, and loses them when old sessions are purged.

**Fix.** None for a game that was not archived. See [Statistics](/docs/admin/statistics/).

### No update notice, although a new release is out

**Cause.** `UPDATE_CHECK` is off; or GitHub did not answer (the server tries again an hour later); or the notice was hidden in this browser ("Hide until the next version"); or the instance runs a development build.

**Fix.** The **Version** card on [Health](/docs/admin/health/#version) says which. The server asks GitHub at most once a day: a release published an hour ago may not show yet.

### The phone test never reaches the instance

**Cause.** The phone is on another network, the Wi-Fi isolates guests, a firewall, a public address without its name or port, or Docker Desktop's bridge network.

**Fix.** See [Health](/docs/admin/health/#phone-test) for each cause, and [Networking](/docs/operator/networking/).

---
title: Health
description: "The health page of the QuizDock administration: the verdict, each part checked, the database migrations, the version and the phone test of invitation addresses."
sidebar:
  order: 9
---

**Administration → Health** answers one question first: is the instance working as it should? Then it shows each part checked, so that the administrator can tell the operator what to fix. Any administrator can read it. Only **Use for invitations**, in the [phone test](#phone-test), changes the instance.

## The verdict

The top of the page says "Everything is fine", or "2 problems to look at", with the number of checks passed through. A problem is a check that failed or warned, or a database migration pending or failed. **Check again** runs the checks once more, for example after the operator fixed something and restarted the instance.

## The checks

The checks are those of `qd doctor`, grouped by part.

| Part | What is checked |
|---|---|
| **Environment** | The authentication mode, the name and the language. Every variable that cannot be read or falls outside what it accepts, and the settings that contradict each other. A problem on a level C1 variable fails the check; on the others, it is a warning. |
| **Database** | PostgreSQL is reachable, and the migrations are applied. |
| **Redis** | Redis is reachable. |
| **Media** | The media folder and the shared templates folder are writable. |
| **Identity provider (OIDC)** | OIDC mode only. Whether participants need an account or may join in open access; the provider's discovery document and its signing keys, reached from the server. |

What fails here is almost always fixed in `.env` or in the infrastructure, then the instance restarted: that is the operator's job. The same checks run from a shell, on the server, in the instance's folder:

```sh
./quizdock doctor
```

It exits with code 1 when something fails. See [Status and doctor](/docs/operator/status-and-doctor/).

## Database migrations

The **Database migrations** card counts the migrations applied, pending and failed, and lists the applied ones, newest first.

A pending migration means the database is behind the version running: the migrations normally run when the instance starts or is upgraded. A failed one needs the operator. See [Upgrade](/docs/operator/upgrade/) and [Troubleshooting](/docs/operator/troubleshooting/).

## Version

The **Version** card compares the version running with the latest stable release of QuizDock:

| The card says | Meaning |
|---|---|
| "The latest stable release" | Up to date. |
| "0.14.0 available since …" | A newer release is out. The [update notice](/docs/admin/overview/#the-update-notice) gives the command to install it. |
| "Update check off (UPDATE_CHECK)" | The check is turned off, for example by the offline answer of the [quick setup](/docs/admin/presets/). |
| "GitHub did not answer: the latest version is unknown" | The server could not reach GitHub. It tries again an hour later. |
| "A development build: not compared" | A build without a release version, made from the source code. |
| "No stable release published yet" | GitHub lists no stable release. |

"Last checked …" says when the server last asked. A newer release is news, not a problem: it does not change the verdict.

With `UPDATE_CHECK` on (the default), the server asks GitHub (`api.github.com`) at most once a day. GitHub sees the server's IP address; nothing else is sent.

## Phone test

The server cannot tell whether a phone reaches it: only a phone can. The **Test from a phone** part lists the candidate invitation addresses: the public address (`APP_PUBLIC_URL`), the local network addresses (`HOST_LAN_IPS`), and the address the page is open at.

1. Choose **Test this address**. A QR code appears.
2. Scan it with a phone connected the way a participant would be: on the guests' Wi-Fi, or on mobile data.
3. When the phone gets through, the page says "Reached from a phone (…)", followed by what the phone's browser says of itself.

A test lasts ten minutes; past that, "This test expired: start it again." Run it again for a new network or a new venue.

**Another address** adds one to test, typed by hand (only its `http(s)://host:port` part is kept).

Once a phone reached an address, **Use for invitations** makes it the instance's invitation address: it is saved as `APP_PUBLIC_URL`, and every lobby, for every host and on every computer, starts from it. The card of that address then says "The instance's invitation address". A host can still choose another address for one game, in the lobby ([Invite players](/docs/host/invite-players/)). The button shows only where the administration may change settings (`ADMIN_WEB_SCOPE=write`, the administration token in local mode); otherwise the page says the address stays as the operator set it.

The setup wizard runs the same test and remembers a reached address, which the host console then offers first.

When the phone does not get through, "Not reached? The usual causes" lists them:

- Not the same network: a local address (192.168…, 10…) only answers phones on that network, and the guests' Wi-Fi is often another one.
- Isolated guests: many guest or public Wi-Fi networks keep devices from seeing each other.
- A firewall refuses incoming connections on the application's port.
- A public address needs a name pointing to the machine and its port open from the Internet, or a reverse proxy, and HTTPS for phones to install the app.
- Docker Desktop, a bridge network: the container cannot see the machine's own addresses; they must be set in `HOST_LAN_IPS`.

`APP_PUBLIC_URL` and `HOST_LAN_IPS` are level C3 settings, changed in [Settings](/docs/admin/settings/). The network side is in [Networking](/docs/operator/networking/).

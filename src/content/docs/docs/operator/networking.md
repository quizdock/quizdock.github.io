---
title: Networking
description: Which address participants' phones open in each setup, what to configure so the right one is offered, and every connection QuizDock makes to the outside.
sidebar:
  order: 5
---

Participants join by opening an address on their phone, from the QR code or the join link. This page makes sure the right address is offered, then lists every connection the server makes to the outside.

## The invitation address

In the lobby, the host's console offers addresses under **Invitation address**:

- `APP_PUBLIC_URL`, first, when it is set;
- the server's local network addresses: `HOST_LAN_IPS` when it is set, otherwise the addresses the application sees on its own network interfaces, Docker bridge addresses left out;
- the address of the page the console is open on;
- **Other address…**, to type any address.

The address chosen is kept for the game (the console, the projection and the share link agree), frozen once the game starts, and remembered by the browser for the next one.

## What to configure, per setup

| Setup | What the console offers by itself | Configure |
|---|---|---|
| A server with a domain name, behind a reverse proxy | The page's address, which is the public one | `APP_PUBLIC_URL=https://quiz.example.org` to offer it first |
| Docker Desktop on a Mac or a PC | No local address: Docker's virtual machine hides the computer's network | `HOST_LAN_IPS=192.168.1.20` (the computer's address, from its network settings) |
| Linux server, the shipped Compose file or the standalone container with `-p` | No local address: the container sits on a Docker bridge network | `HOST_LAN_IPS=192.168.1.20` |
| Linux server, container on the host network (`--network host`) | The server's local addresses, detected | Nothing, or `HOST_LAN_IPS` to offer only one |
| Console opened on `localhost` | "This page" is useless to phones: the console opens its help and preselects a local address when it knows one | One of the above |

`HOST_LAN_IPS` takes bare IPv4 addresses, separated by commas. The console adds the scheme and the port of the page it is open on.

Both variables can also be set from **Administration → Settings** (level C3, applied at once).

## Test it from a phone

The setup wizard and **Administration → Health** offer a phone test for each invitation address: a QR code to scan with a phone on the participants' network. The page records which addresses a phone actually reached. See [Health](/docs/admin/health/).

## When phones cannot reach it

- **Same network.** Phones must be on a network that routes to the server. A guest Wi-Fi often isolates its clients from the rest of the network.
- **Firewall.** The server's firewall must let the published port through (`HTTP_PORT`, `18080` by default).
- **HTTPS page, HTTP address.** When the console is served over HTTPS, an `http://` local address shows a warning on phones. A public address with a certificate avoids it.

## Outgoing connections

The complete list of connections the server opens to the outside:

| Connection | When | What the other side sees | Turn it off |
|---|---|---|---|
| Update check, to `api.github.com` | On by default. At most once a day (once an hour after a failure), only when an administration page, `qd version` or `./quizdock status` asks | The server's IP address and a `QuizDock/<version>` user agent | `UPDATE_CHECK=false`, or the quick setup's **offline** answer |
| Community catalogue | Off by default. Only when `QUIZ_STORE_URL` is set, to the hosts it and `QUIZ_STORE_HOSTS` allow | The server's IP address; no account, quiz or result is sent | Leave `QUIZ_STORE_URL` empty |
| Your OpenID Connect provider | OIDC mode only: discovery, tokens, keys | What sign-in requires | It can be on your internal network |

Nothing else: no telemetry, no e-mail, no webhooks.

Outside the running server:

- The `./quizdock` script downloads its files from `raw.githubusercontent.com` (at `init`), and Docker pulls the images from Docker Hub (at `up` and `upgrade`).
- Browsers, not the server, follow the links to free media libraries in the editor (`MEDIA_LIBRARY_LINKS`), the feedback links on the home page (`APP_FEEDBACK_URL`), and load the images a quiz's text points to on the web.

A server with no Internet access at all: see [Air-gapped installation](/docs/operator/air-gapped/).

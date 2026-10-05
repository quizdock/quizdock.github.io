---
title: Invite players
description: Bring players into a QuizDock room with the PIN, the QR code or a shared link, choose the invitation address, and what players do to join.
sidebar:
  order: 9
---

Players join a room with its 6-digit PIN. They need no app and, in local mode, no account: a browser, the PIN and a nickname. This page covers how you hand out the PIN and what players see.

## Hand out the invitation

In the lobby, the invitation fills the centre of the console. Once the quiz has started, choose the PIN at the top of the console to open it again. It shows:

- the **QR code to join**, which opens the room directly;
- under **Invite players**, the address to type and the 6-digit PIN;
- **Share**: sends the invitation (PIN and direct link) through the device's share sheet, or copies it to the clipboard ("Invitation copied (PIN + link) to the clipboard."). Over plain `http` on a local network, where the browser offers neither, it shows the address to copy: "Copy this address and send it: …";
- the **Invitation address** (below).

**Projection window**, at the end of the console's second row, opens the big screen. In the lobby it shows the QR code, the PIN and "Join at" followed by the address to type.

The direct link has the form `https://your-instance/join/123456`: it opens the room with the PIN already filled in.

## The invitation address

The QR code, the link and the "Join at" line all point at the **Invitation address**. It must be an address the players' phones can reach. Choose it in the lobby, before the quiz starts (it is fixed once the game begins):

- **the instance's address**: the invitation address set for the whole instance, by whoever runs it or by an administrator from the phone test of **Health**. Every lobby starts from it; use it whenever it is offered.
- **this page**: the address in your browser's address bar.
- the network addresses detected for the computer running QuizDock, on a local instance: pick the one of the network the players are on.
- **Other address…**: type one, such as `http://192.168.1.20:8080`, then **Apply**.

**Why this address?** explains the choice in the console. It ends with a link to **Test the addresses from a phone, and set the instance's** for administrators, and says who sets it for everyone else. The usual trap is `localhost` or `127.0.0.1`: they only work on the computer itself, so a phone scanning that QR code gets nowhere. On a local instance, players must be on the same Wi-Fi or network as the computer, and its firewall must let the port through.

If the console finds no local address (common when QuizDock runs in Docker Desktop), type it yourself. Whoever runs your instance can make it appear in the list; see [Networking](/docs/operator/networking/).

When the instance is served over HTTPS and you pick an `http://` local address, phones show a warning. A public address with a certificate avoids it.

## What players do

1. Open the address on the big screen, or scan the QR code.
2. On **Join a room**, type the **PIN, 6 digits** ("Type the PIN shown on the big screen"). It is checked as soon as the 6th digit is in.
3. Pick a **Nickname**, 2 to 20 characters, and an avatar (**Random avatar** draws another).
4. Under **Where are you playing from?**, keep **In the room**, or choose **Remote** when they cannot see the big screen. See [Remote participants](/docs/host/remote-participants/).
5. Choose **Join the room**, then **I'm ready** in the lobby.

The console lists the players as they arrive, in its **Players** tab, and the lobby counts who is ready. A ready player's avatar is ringed green, on the console and on the projection; a remote player's carries a wifi badge.

In OIDC mode with **Accounts required**, players sign in with the identity provider first ("Sign in to take part"); the PIN then opens the room. With **Open access**, the PIN and a nickname are enough.

A player's phone remembers them: if the connection drops or the page reloads, they come back to the same seat and score. The nickname is also remembered for the next room.

## Questions

### Do players need to install an app?

No. A current browser is enough. Phones in the room show the question's text, a small picture and the answer tiles; the question in full is on the big screen.

### Can two players use the same nickname?

No. "This nickname is already taken in this room." The second player picks another.

### Can I stop new players from joining?

Yes. **Close the room to new participants** in the console. Players already in can still come back after a lost connection.

### A player cannot reach the room. What should I check?

The invitation address first: is it `localhost`, or on another network than the phones? Then the PIN, and whether the room is closed to newcomers. See [Troubleshooting](/docs/host/troubleshooting/).

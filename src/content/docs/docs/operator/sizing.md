---
title: Sizing
description: How many players one QuizDock instance served at once in the load test, the vCPU and RAM to plan, and the conditions behind every figure.
sidebar:
  order: 13
---

How much server a QuizDock instance needs depends on how many players answer at the same time, and whether they share one room. This page gives the measured figures, the sizes deduced from them, and what they do not cover.

## The short answer

| Players at once | vCPU | RAM |
|---|---|---|
| Up to 700 in one room, or 20 rooms of 30 | 2 | 2 GB |
| Up to 1500 in one room, or 60 rooms of 30 | 2 | 4 GB |
| More | not measured | not measured |

Read the conditions below before relying on it.

## How it was measured

- **Date:** 2026-09-27, one run per step.
- **Machine:** a cloud micro-VM, Intel Xeon at 2.1 GHz, 4 vCPU, 16 GB of RAM.
- **Software:** the backend under Node 22, PostgreSQL 16 and Redis 7, all on that machine.
- **CPU:** the backend held to **one core**; PostgreSQL and Redis free to use the others.
- **Players:** simulated on the same machine, on the other cores, over the loopback: no network latency, no phones, no Wi-Fi.
- **Quiz:** single-choice questions, **no media**, every player answering within 3 seconds.

No answer was lost at any step.

## One room

Time for the server to acknowledge an answer, on one core:

| Players in the room | 95 % of answers within | Notes |
|--:|--:|---|
| 300 | 7 ms | |
| 700 | 18 ms | |
| 1000 | 29 ms | |
| 1500 | 61 ms | The slowest 1 % took 431 ms in one run, 52 ms in another |
| More | not measured | |

The devices of a room received each question within about 40 ms of each other up to 700 players (95th percentile), 60 to 80 ms at 1000 to 1500.

## Several rooms at once

Rooms of 30, all started together (the worst case), on one core:

| Rooms | Players | 95 % within | 99 % within |
|--:|--:|--:|--:|
| 10 | 300 | 7 ms | 11 ms |
| 20 | 600 | 6 ms | 10 ms |
| 30 | 900 | 7 ms | 12 ms |
| 40 | 1200 | 8 ms | 12 ms |
| 50 | 1500 | 9 ms | 14 ms |
| 60 | 1800 | 25 ms | 105 ms |
| More | | not measured | |

In a room of 30, the devices received each question within 2 ms of each other. Several small rooms cost the server less than one room of the same total: an event of a room goes to that room's devices only.

## Where the vCPU and RAM come from

They are **deduced** from the measurements, not measured on a server of that size:

- **vCPU:** one core for the backend (as measured), one for PostgreSQL, Redis and the system, hence 2. A server with **one vCPU** for everything was not measured and is not advised.
- **RAM:** nothing was limited during the test. The backend's memory was about 250 MB at rest, about 500 MB at 700 to 1000 players, about 0.9 to 1 GB at 1500 to 1800. The column adds room for PostgreSQL, Redis and the system.

## Why more vCPU do not help

The game engine runs on Node's single JavaScript thread: an instance plays its rooms on **one core**. A second vCPU takes PostgreSQL, Redis, the garbage collector and the network, which is why 2 are advised; a third or a fourth changes nothing for the game. A **faster core** does.

QuizDock runs as one application process: it does not spread rooms over several servers.

## What the figures do not cover

- **Sound and video.** Every device that plays a question's media downloads it. Bandwidth and the reverse proxy then matter more than the CPU. Not measured.
- **A real network.** Phones over Wi-Fi add their own latency; how far apart the devices see a question then depends on their connections more than on the server.
- **Archiving a large game in PostgreSQL**, and rooms that start at different times: not measured.
- **The standalone image**, where PostgreSQL, Redis and the application share one container: not measured separately.

The load-test script ships in QuizDock's source repository: the measurement can be repeated on your own hardware.

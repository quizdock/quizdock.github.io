---
title: Media of the instance
description: What the media volume of a QuizDock instance holds, the automatic clean-up of unused media, deleting a file for moderation, global media for every host, and the media limits.
sidebar:
  order: 4
---

**Administration → Media** ("Instance media") shows what the media volume holds and lets an administrator clean it up, remove a file, and offer media to every host.

These operations need the admin role. `ADMIN_WEB_SCOPE` does not concern them, and in local mode they work without the administration token. Every change is recorded in the [audit](/docs/admin/audit/).

## What is stored

Hosts add images, videos and sounds to their questions and slides. The editor converts each file in the author's browser, before it is sent; the server never converts anything.

| Kind | Stored as |
|---|---|
| Image | WebP, longest edge at most 1920 px |
| Video | MP4 (H.264 and AAC), short edge at most 1080 px, at most 30 frames per second |
| Sound | M4A (AAC), 128 kb/s |

The server checks every file by its content, never by its name. It also accepts the formats stored before the converter existed (MP3, PNG, JPEG, GIF, AVIF), which keep playing; quizzes imported from elsewhere may carry them. The page marks them "older format".

A file is stored once per content: the same image uploaded twice, or brought back by importing a quiz, takes the room of one.

## Disk

The **Disk** card gives the number of files and their size, by kind (images, videos, sounds) and by owner, and the files in older formats.

## Clean-up

Every hour, and once when the backend starts, the instance deletes the media nothing uses any more, once they are a day old. For example: an upload whose form was abandoned, a media replaced in a question, an image taken out of a text.

A media stays as long as a quiz, a room being played, or an archived session still refers to it. Archived results show the questions as they were, with their media.

The **Clean-up** card shows:

- the media used by nothing, and how many are still within their day of grace;
- the files on disk that no media points to;
- when the last pass ran;
- **Run now**, to run a pass at once instead of waiting for the next one.

The same pass deletes the stray files in the media folder. It touches only the names the backend gives its files.

The clean-up stops itself when the database and the volume do not match:

- "The database holds no media but the volume holds files: nothing is purged. Check that the database and the media volume belong together."
- "Some media have lost their file: the database looks older than the media volume (restored alone?). Stored files are kept until they match."

Both usually mean that the database and the media were not restored from the same backup: see [Restore](/docs/operator/restore/).

## Files

The **Files** list shows every file with its owners, size, dimensions and where it is used. Filters: kind, owner, older formats only, a search by file name. Sort by size, usage or date. **Which files** switches between **All** and **Global**; **Display** between a list and a grid.

Choosing a file shows it in full, with its format, dimensions, duration, size, owners, usages, credit and date, and every quiz that uses it.

### Delete a file

An administrator can delete a file even when it is used, for moderation.

1. Choose the file, then delete it.
2. The confirmation lists what breaks: the quizzes that use it ("The questions lose this media.") and the archived sessions ("Past results no longer show it."). "Every copy of this file goes, whoever owns it."
3. Confirm.

A file cannot be deleted while a room is playing it: "A room is playing it: it cannot be deleted until the room closes."

## Global media

Global media are images, videos and sounds an administrator offers to every host. Hosts find them under **Global media** in their media library. Picking one gives the host a media of their own on the same file, with its credit; nothing is copied on disk.

- Add one from the **Global** view: **Add an image**, **Add a video**, **Add a sound**. The file is converted in the browser, as in the editor.
- Or take an existing file from the **All** view: **Add to the global media**.
- Give it a **Credit (author, licence, source)**. A CC-BY or CC-BY-SA licence asks for one.
- **Withdraw** stops offering it. "Hosts no longer find it in their library. The quizzes that use it keep their copy."

A global media has no alternative text: it depends on the question and on the quiz's language, so the host writes it. Global media are never cleaned up.

Deleting the file of a global media from the **All** view is different from withdrawing it: it also removes the copies hosts took, and their quizzes lose it.

## Limits

These settings bound what hosts upload. They are level C2: changed from [Settings](/docs/admin/settings/) with `ADMIN_WEB_SCOPE=write`, each change confirmed.

| Setting | Default | Applies to |
|---|---|---|
| `MEDIA_MAX_BYTES` | 10 MB | an image |
| `MEDIA_MAX_VIDEO_MB` | 50 MB | a video |
| `MEDIA_MAX_AUDIO_MB` | 10 MB | a sound |
| `IMPORT_MAX_BYTES` | 50 MB | an imported quiz bundle, media included |

Behind a reverse proxy, its request body limit must be at least the largest of these: raising a limit here is not enough on its own. See [Reverse proxy](/docs/operator/reverse-proxy/).

`MEDIA_LIBRARY_LINKS` sets the free media libraries the editor links to (seven by default, open licences only), or `none` to hide them on an instance without Internet. They are plain links in the host's browser: the server fetches nothing from them.

For what hosts see, see [Media in quizzes](/docs/host/media/).

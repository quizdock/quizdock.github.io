---
title: Branding
description: "Give a QuizDock instance your organisation's name, logo and colours, without rebuilding the image: four settings and an optional folder of files."
sidebar:
  order: 8
---

A QuizDock instance can carry your organisation's name, logo and colours. Nothing is rebuilt: four settings, and an optional folder of files mounted into the container.

Who does what:

- **The four settings** (`APP_NAME`, `APP_LANG`, `APP_LOGO_URL`, `APP_FEEDBACK_URL`) are level C4. An administrator changes them in **Administration → Settings** (with `ADMIN_WEB_SCOPE=write`), or at the **Identity** step of the setup wizard. The operator can also set them in `.env`. They apply at once.
- **The branding folder** (logo file, icon, stylesheet) lives on the server. Whoever runs the instance puts it there and mounts it: an administrator cannot upload it from the web.

## The four settings

| Setting | What it does | Accepts | Default |
|---|---|---|---|
| `APP_NAME` | The name in the header, the browser tab, the share messages, and the app installed on a phone. | 1 to 40 characters | `QuizDock` |
| `APP_LANG` | The language of the interface, for the whole instance (no browser detection). New quizzes start in this language; each quiz can be set to another. | `en`, `fr`, `es`, `zh`, `zh-TW`, `tr` | `en` |
| `APP_LOGO_URL` | A logo hosted somewhere else (a CDN, a path outside the branding folder). Empty: the logo is looked up in the branding folder. | an `https://` address | empty |
| `APP_FEEDBACK_URL` | Where the home page's feedback links lead (below). | an `http(s)://` address, or `none` | empty |

### Feedback links

The home page offers **Report a bug**, **Suggest a feature**, **Fix a translation** and **Ask a question**.

| `APP_FEEDBACK_URL` | The links |
|---|---|
| empty | The QuizDock repository, its forms filled in with the version, the browser and the language, and an invitation to star QuizDock on GitHub. |
| another GitHub repository (`https://github.com/owner/repo`) | The same forms, in that repository. Copy QuizDock's `.github/ISSUE_TEMPLATE/` folder into it. |
| any other address | A single **Send feedback** link. |
| `none` | No links. |

## The branding folder

Two files are served at fixed addresses, and both are optional:

- `/branding/logo.<ext>`: the header logo. The page tries `logo.svg`, `logo.avif`, `logo.webp`, `logo.png`, `logo.jpg`, `logo.jpeg` and `logo.gif`, in that order, and keeps the first one that loads. Put **one** logo file in the format you have. Without one, the header shows QuizDock's logo. `APP_LOGO_URL` skips this lookup.
- `/branding/override.css`: a stylesheet loaded after the app's own, to change colours, the typeface or any rule (below). Without one, nothing is overridden.

A third one gives the icon:

- `/branding/favicon.png`: the browser tab and the home screen of a phone. Without one, QuizDock's icon is used.

### Mount the folder

The operator mounts a folder over `/app/client/branding` in the container, read-only.

With Compose, in `docker-compose.prod.yml`, uncomment the line under the `quizdock` service's `volumes:`:

```yaml
      - ./branding:/app/client/branding:ro
```

With the standalone image, add the volume when the container is created:

```sh
docker run -p 18080:3000 \
  -v quizdock:/data \
  -v "$PWD/branding:/app/client/branding:ro" \
  fchaussin/quizdock:standalone
```

A change to the files inside the folder needs no restart: reload the page.

:::caution
The mount replaces the whole folder, QuizDock's defaults included. Keep only one `logo.*` file: a `logo.svg` left behind wins over your `logo.png`.

`./quizdock backup` does not copy the branding folder: keep your files somewhere safe.
:::

### Logo

The logo is drawn 28 px high, with a free width. Keep it between 1:1 and about 3:1: at 4:1 the header navigation wraps on a 360 px wide phone. Use an SVG, or an image at least 56 px high with a transparent background.

### Icon

The icon of the browser tab and of a phone's home screen, apart from the header logo, which may be wide:

- **PNG, square, 512 × 512**: the browser scales it down for the tab.
- **Opaque**, the logo on its own background: iOS fills transparency with black.
- **The logo in the centre 80 %**: Android may crop the icon to a circle.

The installed app takes `APP_NAME` as its name and `APP_LANG` as its language. A device keeps the icon it was installed with: a new icon shows on a new install.

## Colours and type

`override.css` is loaded after the app's stylesheet, so a variable set in `:root` there wins.

| Token | What it colours |
|---|---|
| `--primary`, `--primary-foreground` | Buttons, links, the focus ring, the leaderboard bars. |
| `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border` | The surfaces and their text. |
| `--success`, `--destructive`, `--warning` | Right, wrong, and the second half of a question's time (red for its last fifth); the rating stars. |
| `--warning-text` | Words in that amber on a light background (the double points badge). |
| `--answer-red`, `--answer-blue`, `--answer-yellow`, `--answer-green`, `--answer-purple`, `--answer-orange`, `--answer-pink`, `--answer-teal` | Each answer's colour, as the quiz's author picked it (tiles, legends, reveal bars). |
| `--answer-none` | An answer with no colour. |
| `--podium-1`, `--podium-2`, `--podium-3` | The podium's steps. |
| `--font-sans` | The app's typeface. |
| `--radius` | The roundness of cards, buttons and fields. |

QuizDock writes its colours in [oklch](https://oklch.com); any CSS colour works.

A question's or a slide's background carries `data-scheme`: `dark` under light text, `light` under dark text. Inside it, QuizDock sets the neutral tokens (`--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground`, `--border`, `--input`…) to that local palette. Your brand colours (`--primary`, `--answer-*`, `--success`…) stay as you set them.

### Your own typeface

The instance's pages load fonts and stylesheets from the instance itself only: a font service on another address is blocked. Put the font file in the branding folder and declare it in `override.css`:

```css
@font-face {
  font-family: 'Atkinson Hyperlegible';
  src: url('/branding/atkinson-hyperlegible.woff2') format('woff2');
}
:root {
  --font-sans: 'Atkinson Hyperlegible', system-ui, sans-serif;
}
```

## Hooks on the live screens

The home page, the participant's phone, the projected screen and the host's console carry `qd-*` classes that stay the same across versions, whatever their markup becomes; a change to one is noted in the release notes. They have no style of their own: only yours. States are `data-*` attributes.

| Hook | Where | Attributes |
|---|---|---|
| `qd-shell` | Every page's outer frame. | `data-shell`: `app`, `participant` (a phone), `bare` (the projection) |
| `qd-header`, `qd-logo`, `qd-main` | The top bar, its logo, the page area. | |
| `qd-home`, `qd-pin-form` | The home page; the form to type a PIN (also on `/join`). | |
| `qd-screen` | The projected screen. | `data-state`: the game's state (`LOBBY`, `ANSWERING`, `REVEAL`, `LEADERBOARD`, `PODIUM`…) |
| `qd-player` | The participant's phone. | `data-state` |
| `qd-console` | The host's console. | `data-state` |
| `qd-lobby`, `qd-roster` | The projection's lobby; its list of participants. | |
| `qd-join`, `qd-join-pin`, `qd-join-qr` | How to join: the reminder in the projection's top band (a chip on a slide), the PIN, the QR code. | |
| `qd-band` | The projection's top and bottom bands. | `data-band`: `top`, `bottom` |
| `qd-timer` | A question's clock. | `data-tone`: `ok`, `warning`, `critical`, `paused` |
| `qd-chrono` | The console's clock and its ± buttons. | |
| `qd-prompt` | A question's text. | |
| `qd-rules` | The line under it (one answer, several, double points…). | |
| `qd-answers` | The answers. | `data-layout`: `list` (a phone's legend), `images` (picture answers) |
| `qd-answer` | One answer. | `data-color`, `data-correct` (`true`/`false`, once revealed), `data-picked` |
| `qd-reveal`, `qd-distribution`, `qd-closest` | The answer revealed, how the room answered, the closest numbers. | |
| `qd-explanation` | The explanation shown with the answer. | |
| `qd-verdict` | Right or wrong, on the phone. | `data-correct` |
| `qd-leaderboard`, `qd-leaderboard-row` | The ranking and each line. | `data-rank`, `data-you` (the participant's own line) |
| `qd-podium`, `qd-podium-step` | The podium and each step. | `data-rank` |
| `qd-slide` | A content slide. | |
| `qd-connection-lost` | The banner shown while a device's connection is down. | |

`qd-player` and `qd-console` draw no box of their own: use them to scope a rule (`.qd-player .qd-answer`), and `.qd-shell[data-shell="participant"]` for the phone's background.

## Example

`branding/override.css`:

```css
:root {
  --primary: oklch(0.55 0.2 150);
  /* Brand colours for the four usual answers. */
  --answer-red: #d7263d;
  --answer-blue: #1b998b;
  --answer-yellow: #f4a259;
  --answer-green: #2e294e;
  --podium-1: gold;
}

/* A bigger PIN on the projection's lobby. */
.qd-screen[data-state='LOBBY'] .qd-join-pin {
  font-size: 6em;
}

/* Right answers outlined in the brand colour once revealed. */
.qd-answer[data-correct='true'] {
  outline: 0.2em solid var(--primary);
}

/* The last seconds in bold on the big screen. */
.qd-screen .qd-timer[data-tone='critical'] {
  font-weight: 900;
  color: var(--destructive);
}
```

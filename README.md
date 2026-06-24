# quizdock.github.io

Landing page for **QuizDock** — an open-source, self-hosted live quiz platform.

🔗 **Live site:** https://quizdock.github.io
📦 **Code:** https://github.com/quizdock/quiz-dock

## What this repo is

A single static page (`index.html` + `styles.css`) — no build step, no framework.
Deployed to GitHub Pages by the workflow in `.github/workflows/pages.yml`
(`upload-pages-artifact` → `deploy-pages`).

## Enabling Pages (one-time)

In repo **Settings → Pages → Build and deployment**, set **Source: GitHub Actions**.
Every push to `main` then publishes automatically.

## Local preview

No tooling required — open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Editing

- Copy / sections live in `index.html`.
- Theme tokens (colors, radius, fonts) are CSS variables at the top of `styles.css`.
- Brand mark is inline SVG (cyan `#22d3ee`); favicon is `favicon.svg`.

## TODO

- [ ] Add a license badge once the code repo's license is set.
- [ ] Point links to `quizdock/quiz-dock` if the code repo is transferred to the org.
- [ ] Optional custom domain (`quizdock.io` / `.fr`) via a `CNAME` file + DNS.

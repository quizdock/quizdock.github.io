# quizdock.github.io

The website of **QuizDock**, an open-source live quiz platform you run on your
own infrastructure: the product pages and the Documentation.

🔗 **Live site:** https://quizdock.github.io

## How it is built

- [Astro](https://astro.build) for the product pages (`src/pages/`), and
  [Starlight](https://starlight.astro.build) for the Documentation
  (`src/content/docs/docs/`, served under `/docs/`).
- Two pages are generated from QuizDock's code at its **latest release**:
  `scripts/release-data.mjs` fetches `schema/settings.json` (the environment
  reference) and `schema/quiz-format-guide.md` from the release tag before each
  build, into `src/generated/` (not committed).
- `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
  push to `main` and once a day, so a new release reaches those pages on its own.

## Local preview

Only Docker is needed: `bin/npm` runs npm in a `node:24` container.

```sh
./bin/npm install
./bin/npm run dev                                # http://localhost:4321, latest release
QUIZDOCK_DATA_DIR=../quiz-dock ./bin/npm run dev # generated pages from a quiz-dock checkout
./bin/npm run build                              # dist/
```

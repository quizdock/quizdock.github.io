// What the site renders from the latest QuizDock release, fetched before each
// build into src/generated/: the environment reference (schema/settings.json)
// and the quiz format guide (schema/quiz-format-guide.md), both generated from
// the code. QUIZDOCK_DATA_DIR, a quiz-dock checkout, takes them from there
// instead (before a release, or offline).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const OUT = 'src/generated';
const FILES = ['schema/settings.json', 'schema/quiz-format-guide.md'];
const REPO = 'quizdock/quiz-dock';

/** A Markdown file goes inside a page that has its own title: its first heading is dropped. */
const page = (file, text) => (file.endsWith('.md') ? text.replace(/^# .*\n+/, '') : text);

mkdirSync(OUT, { recursive: true });
const local = process.env.QUIZDOCK_DATA_DIR;
if (local) {
  for (const file of FILES)
    writeFileSync(join(OUT, basename(file)), page(file, readFileSync(join(local, file), 'utf8')));
  writeFileSync(join(OUT, 'release.json'), JSON.stringify({ version: 'local', publishedAt: null }));
  console.log(`release data: from ${local}`);
} else {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { accept: 'application/vnd.github+json', 'user-agent': 'quizdock-site' },
  });
  if (!res.ok) throw new Error(`latest release: HTTP ${res.status}`);
  const release = await res.json();
  for (const file of FILES) {
    const raw = await fetch(`https://raw.githubusercontent.com/${REPO}/${release.tag_name}/${file}`);
    if (!raw.ok) throw new Error(`${file} at ${release.tag_name}: HTTP ${raw.status}`);
    writeFileSync(join(OUT, basename(file)), page(file, await raw.text()));
  }
  writeFileSync(
    join(OUT, 'release.json'),
    JSON.stringify({ version: release.tag_name.replace(/^v/, ''), publishedAt: release.published_at }),
  );
  console.log(`release data: ${release.tag_name}`);
}

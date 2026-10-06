// What the site renders from the latest QuizDock release, fetched before each
// build into src/generated/: the environment reference (schema/settings.json)
// and the quiz format guide (schema/quiz-format-guide.md), both generated from
// the code. The screenshots and the demo GIF (docs/screenshots) come from main,
// where they land when they are taken again, release or not: they go to
// public/screenshots/ and public/demo.gif. QUIZDOCK_DATA_DIR, a quiz-dock
// checkout, takes them from there instead (before a release, or offline).
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const OUT = 'src/generated';
const FILES = ['schema/settings.json', 'schema/quiz-format-guide.md'];
const REPO = 'quizdock/quiz-dock';
const SHOTS = 'docs/screenshots';
const SHOTS_REF = 'main';
const isShot = (path) => /\.(png|gif)$/.test(path);

/** A Markdown file goes inside a page that has its own title: its first heading is dropped. */
const page = (file, text) => (file.endsWith('.md') ? text.replace(/^# .*\n+/, '') : text);

mkdirSync(OUT, { recursive: true });
rmSync('public/screenshots', { recursive: true, force: true });
const local = process.env.QUIZDOCK_DATA_DIR;
if (local) {
  for (const file of FILES)
    writeFileSync(join(OUT, basename(file)), page(file, readFileSync(join(local, file), 'utf8')));
  cpSync(join(local, SHOTS), 'public/screenshots', { recursive: true, filter: (p) => !p.endsWith('.md') });
  cpSync(join(local, SHOTS, 'demo.gif'), 'public/demo.gif');
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
  const tree = await fetch(
    `https://api.github.com/repos/${REPO}/git/trees/${SHOTS_REF}?recursive=1`,
    { headers: { accept: 'application/vnd.github+json', 'user-agent': 'quizdock-site' } },
  );
  if (!tree.ok) throw new Error(`tree at ${SHOTS_REF}: HTTP ${tree.status}`);
  const shots = (await tree.json()).tree
    .map((e) => e.path)
    .filter((p) => p.startsWith(`${SHOTS}/`) && isShot(p));
  for (const file of shots) {
    const raw = await fetch(`https://raw.githubusercontent.com/${REPO}/${SHOTS_REF}/${file}`);
    if (!raw.ok) throw new Error(`${file} at ${SHOTS_REF}: HTTP ${raw.status}`);
    const to = join('public/screenshots', file.slice(SHOTS.length + 1));
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, Buffer.from(await raw.arrayBuffer()));
  }
  cpSync('public/screenshots/demo.gif', 'public/demo.gif');
  writeFileSync(
    join(OUT, 'release.json'),
    JSON.stringify({ version: release.tag_name.replace(/^v/, ''), publishedAt: release.published_at }),
  );
  console.log(`release data: ${release.tag_name}`);
}

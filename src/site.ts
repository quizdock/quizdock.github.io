/** Addresses and navigation shared by every page. */
export const DEMO_URL = 'https://quizdock-standalone.onrender.com';
/**
 * A second demo, the same but never asleep, while its hosting credit lasts. Set it to null
 * and every link to it goes (`AltDemo.astro`, the menus).
 */
export const ALT_DEMO_URL: string | null = 'https://quizdock-production-bd94.up.railway.app';
export const DOCKER_HUB_URL = 'https://hub.docker.com/r/fchaussin/quizdock';
export const SOURCE_URL = 'https://github.com/quizdock/quizdock';
export const CHANGELOG_URL = 'https://github.com/quizdock/quizdock/blob/main/CHANGELOG.md';
export const TRANSLATE_URL = 'https://hosted.weblate.org/engage/quizdock/';

export const WHY = [
  { href: '/plug-and-play/', title: 'Plug-and-play', line: 'Start in minutes, operate without fuss' },
  { href: '/self-hosted/', title: 'Self-hosted', line: 'Your servers, your network, your data' },
  { href: '/enterprise/', title: 'Enterprise', line: 'SSO, roles, administration, audit' },
  { href: '/real-time/', title: 'Real time', line: 'Server timing, measured performance' },
  { href: '/privacy/', title: 'Privacy', line: 'What is kept, and who decides' },
  { href: '/media/', title: 'Media', line: 'Video and audio, started together' },
  { href: '/accessibility/', title: 'Accessibility', line: 'What is built in, what is not yet' },
];

export const USE_CASES = [
  { href: '/use-cases/education/', title: 'Education' },
  { href: '/use-cases/enterprise-training/', title: 'Enterprise training' },
  { href: '/use-cases/events/', title: 'Events' },
];

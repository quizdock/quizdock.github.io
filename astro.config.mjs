import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// The product pages are plain Astro pages (src/pages); the Documentation is
// Starlight (src/content/docs/docs), under /docs/.
export default defineConfig({
  site: 'https://quizdock.github.io',
  trailingSlash: 'always',
  compressHTML: false,
  integrations: [
    starlight({
      title: 'QuizDock',
      logo: { src: './src/assets/icon.svg' },
      favicon: '/icon.svg',
      customCss: ['./src/styles/starlight.css'],
      components: { SocialIcons: './src/components/DocsHeaderLinks.astro' },
      sidebar: [
        { label: 'Documentation', link: '/docs/' },
        { label: 'Host', items: [{ autogenerate: { directory: 'docs/host' } }] },
        { label: 'Admin', items: [{ autogenerate: { directory: 'docs/admin' } }] },
        { label: 'Operator (DevOps)', items: [{ autogenerate: { directory: 'docs/operator' } }] },
      ],
    }),
  ],
});

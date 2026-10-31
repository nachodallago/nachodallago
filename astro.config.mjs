// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nachodallago.com',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    // CSS crítico inline: cero requests bloqueantes en el primer render
    inlineStylesheets: 'always',
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/fc26') })],
  vite: {
    plugins: [tailwindcss()],
    // En dev, la API de FC 26 corre aparte con `npm run api`
    server: {
      proxy: { '/api/fc26': 'http://127.0.0.1:8787' },
    },
  },
});

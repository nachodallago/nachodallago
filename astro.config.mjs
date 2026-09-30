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
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

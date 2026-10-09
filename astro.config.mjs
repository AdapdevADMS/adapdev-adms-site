// @ts-check
// Astro configuration for the ADMS product site.
//
// Served at https://adapdev.com.au/adms via the Cloudflare Worker that
// routes /adms/* on the apex domain to this Pages project (see section 10
// of the ADMS Website Build Guide). The `base` setting below is what makes
// every emitted URL carry the /adms prefix; do NOT scaffold this project
// inside a sub-folder called "adms" - the prefix is a config value, not a
// filesystem path.

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://adapdev.com.au',
  base: '/adms',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [sitemap()],
  vite: {
    ssr: {
      noExternal: ['@fontsource-variable/inter', '@fontsource/jetbrains-mono'],
    },
  },
});

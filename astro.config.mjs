// @ts-check
// Astro configuration for the ADMS product site.
//
// Served at https://adapdev.com.au/adms via the Cloudflare Worker that
// routes /adms/* on the apex domain to this Pages project. The `base`
// setting below is what makes every emitted URL carry the /adms prefix;
// do NOT scaffold this project inside a sub-folder called "adms" - the
// prefix is a config value, not a filesystem path.
//
// Theme bones from Lapse (lapse-ai-saas-template); branding and content
// from the Adapdev primary site (adapdev.com.au) adapted for the ADMS
// product.

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  site: 'https://adapdev.com.au',
  base: '/adms',
  trailingSlash: 'never',

  build: {
    format: 'file',
    // The stylesheets are small, so they go inside the page instead of
    // blocking the first paint as separate requests.
    inlineStylesheets: 'always',
  },

  // sitemap-index.xml for search engines; the 404 page is left out.
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],

  // Markdown processor defaults preserve the copy's punctuation
  // exactly as written (no smart-quote / em-dash conversion). The
  // previous `markdown.smartypants: false` was deprecated in Astro
  // 5 and removed here; opt back in via remark-smartypants if ever
  // needed.
  devToolbar: { enabled: false },

  adapter: cloudflare()
});
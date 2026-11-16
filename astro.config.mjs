// @ts-check
// Astro configuration for the ADMS product site.
//
// Served at https://adapdev.com.au/adms via a Cloudflare Workers Static
// Assets deployment that is route-bound to /adms/* on the apex domain.
// The `base` setting below is what makes every emitted URL carry the
// /adms prefix; do NOT scaffold this project inside a sub-folder called
// "adms" — the prefix is a config value, not a filesystem path.
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

  // Single `build` block — a second `build: {...}` further down would
  // silently replace this one in JavaScript, dropping these settings.
  //
  // `format: 'file'` emits /foo.html rather than /foo/index.html, which
  // keeps URL shapes stable under `trailingSlash: 'never'`.
  //
  // `inlineStylesheets: 'always'` puts the (small) CSS inline so the
  // first paint is not blocked by a separate stylesheet request.
  //
  // NOTE: `assetsPrefix` is intentionally NOT set. `base: '/adms'`
  // already prepends the /adms segment to every emitted URL, including
  // _astro/* assets. Adding `assetsPrefix: '/adms'` would double-prefix
  // them to /adms/adms/_astro/... — `assetsPrefix` is for serving assets
  // from a different origin (a CDN host), not for a path prefix.
  build: {
    format: 'file',
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

  // `platformProxy` is only meaningful for `output: 'server'` (it
  // emulates the Workers runtime in `astro dev`). For a fully static
  // build it is a no-op, so it is not set.
  adapter: cloudflare(),
});

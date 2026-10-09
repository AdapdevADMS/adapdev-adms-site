# adapdev-adms-site

Product marketing site for **ADMS** (Adapdev Document Management System),
served at `https://adapdev.com.au/adms` via a Cloudflare Worker that routes
`/adms/*` on the apex domain to this Cloudflare Pages project.

## Stack

- **Framework:** [Astro 5](https://astro.build) (static output)
- **Language:** TypeScript (strict)
- **Fonts:** Inter (variable) + JetBrains Mono, self-hosted via `@fontsource*`
- **Hosting:** Cloudflare Pages (free tier), project name `adapdev-adms-site`
- **Routing:** Cloudflare Worker at the `adapdev.com.au` zone root proxies
  `/adms` and `/adms/*` to this project; everything else goes to the
  corporate site project `adapdev-site`

## Local development

```bash
npm install          # or pnpm install
npm run dev          # http://localhost:4321/adms
npm run build        # emits ./dist
npm run preview      # preview the built site
npm run check        # astro check
```

Requires Node.js 20 LTS or later.

## Project layout

```
.
├── astro.config.mjs      # base: '/adms'
├── public/
│   ├── _headers          # CSP, HSTS, X-Frame-Options, ...
│   ├── favicon.svg
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── components/       # Header, Footer, FeatureCard, PricingCard, SharedUI
│   ├── content/
│   │   ├── releaseNotes/ # Markdown release-note entries (content collection)
│   │   └── config.ts     # Zod schema for releaseNotes
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro            # /adms              - overview
│   │   ├── features.astro         # /adms/features
│   │   ├── pricing.astro          # /adms/pricing
│   │   ├── downloads.astro        # /adms/downloads
│   │   ├── support.astro          # /adms/support
│   │   └── release-notes/
│   │       ├── index.astro        # /adms/release-notes
│   │       └── [...slug].astro    # /adms/release-notes/v1.0.0
│   └── styles/
│       ├── tokens.css    # Brand palette + typography (shared with corp site)
│       └── global.css    # Reset + base typography + utility classes
└── tsconfig.json
```

## Secrets

**No secret belongs in this repository.** All credentials for Cloudflare,
GitHub, VentraIP and third-party services live in the 1Password **ADAPDEV**
vault; CI reads what it needs from GitHub Actions encrypted secrets. See
`ADMS-Secret-Storage-Setup.docx` for the two-tier model.

## Related

- `adapdevADMS/adapdev.com.au` -- corporate site + routing Worker
- `ADMS-Website-Build-Guide.docx` -- step-by-step build guide (section 10)
- `ADMS-Secret-Storage-Setup.docx` -- secret management

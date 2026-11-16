/**
 * Astro content collections.
 *
 * blog
 * ----
 * Carried over from the Lapse scaffold. Not shown in the ADMS nav, but kept
 * so adapdev.com.au's blog articles can be imported here if a sub-site blog
 * is ever added.
 *
 * releaseNotes
 * ------------
 * One Markdown file per ADMS release in src/content/releaseNotes/<file>.md.
 * The URL slug comes from the file name (release-notes/<slug>). Frontmatter
 * carries version, title, description, pubDate, channel and highlights,
 * validated at build time; the body is ordinary Markdown.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** Must match one of the tabs in src/content/pages/blog.json to be filterable. */
    category: z.string(),
    date: z.coerce.date(),
    readTime: z.string(),
    excerpt: z.string(),
    featured: z.boolean().default(false),
    cover: z.string(),
    coverAlt: z.string().default(''),
    author: z.object({
      name: z.string(),
      role: z.string(),
      avatar: z.string(),
      avatarAlt: z.string().default(''),
    }),
  }),
});

const releaseNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/releaseNotes' }),
  schema: z.object({
    /** Semver string, e.g. "1.0.0". Rendered beside the title. */
    version: z.string().min(1).max(32),
    title: z.string().min(2).max(140),
    description: z.string().min(10).max(220),
    /** ISO date in the frontmatter; shown in long-form Australian English. */
    pubDate: z.coerce.date(),
    /** Release channel; drives the badge colour and the /release-notes tab filter. */
    channel: z.enum(['stable', 'preview', 'beta']).default('stable'),
    /** 1-5 one-line highlights for the index card and the detail page callout. */
    highlights: z.array(z.string()).default([]),
    /** When true the release is excluded from the index and RSS feed. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, releaseNotes };

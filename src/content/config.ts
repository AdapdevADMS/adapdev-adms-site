/**
 * Astro Content Collections - schema for the releaseNotes collection.
 *
 * Every entry in src/content/releaseNotes/ is validated against this schema
 * at build time; missing or malformed frontmatter produces a build error.
 */

import { defineCollection, z } from 'astro:content';

const releaseNotes = defineCollection({
  type: 'content',
  schema: z.object({
    version: z.string().min(1).max(32),            // e.g. "1.0.0"
    title: z.string().min(2).max(140),             // e.g. "ADMS 1.0.0"
    description: z.string().min(10).max(220),
    pubDate: z.coerce.date(),
    channel: z.enum(['stable', 'preview', 'beta']).default('stable'),
    highlights: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { releaseNotes };

/**
 * /adms/release-notes/rss.xml
 *
 * Pure data endpoint; respects BASE_URL so the item links resolve against
 * the sub-site root rather than the corporate parent.
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext): Promise<Response> {
  const releases = (await getCollection('releaseNotes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

  const base = (import.meta.env.BASE_URL ?? '/adms').replace(/\/$/, '');

  return rss({
    title: 'ADMS — Release notes',
    description: 'Adapdev Document Management System release notes, newest first.',
    site: context.site ?? 'https://adapdev.com.au',
    items: releases.map((r) => ({
      title: r.data.title,
      description: r.data.description,
      pubDate: r.data.pubDate,
      link: `${base}/release-notes/${r.id}`,
    })),
    customData: '<language>en-au</language>',
  });
}

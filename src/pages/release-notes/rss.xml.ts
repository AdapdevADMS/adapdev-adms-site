/**
 * Release notes RSS feed - /adms/release-notes/rss.xml
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext): Promise<Response> {
  const releases = (await getCollection('releaseNotes', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const B = (import.meta.env.BASE_URL ?? '/adms').replace(/\/$/, '');

  return rss({
    title: 'ADMS - Release notes',
    description:
      'Adapdev Document Management System release notes, newest first.',
    site: context.site ?? 'https://adapdev.com.au',
    items: releases.map((r) => ({
      title: r.data.title,
      description: r.data.description,
      pubDate: r.data.pubDate,
      link: `${B}/release-notes/${r.slug}`,
    })),
    customData: '<language>en-au</language>',
  });
}

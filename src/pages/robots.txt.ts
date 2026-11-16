import type { APIRoute } from 'astro';

/**
 * /adms/robots.txt
 *
 * Built from `site` in astro.config.mjs, so the sitemap URL tracks the
 * configured domain and base path.
 */
export const GET: APIRoute = ({ site }) => {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
  const sitemap = new URL(`${base}/sitemap-index.xml`, site).href;
  const body = `User-agent: *\nAllow: ${base || '/'}\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

import type { Locale, Post } from '@/lib/posts';
import { HREFLANG, SITE_URL } from '@/lib/seo';

// Núcleo PURO do feed RSS 2.0 (MAI-526). Summary-only: title/link/guid/pubDate/
// description/categories por item — sem o corpo do post (full-text é MAI-660). Sem
// lib de feed: hand-rolled e testável. O IO (posts, getTranslations) fica nas rotas.

// Só os 5 caracteres especiais de XML. & PRIMEIRO, senão re-escaparia os &lt; etc.
// Acento (é, ã, ç) passa cru — o documento é UTF-8, não vira entidade.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// post.date é 'YYYY-MM-DD' -> Date parseia como UTC 00:00 -> RFC-822 (pub/lastBuild).
function toRfc822(date: string): string {
  return new Date(date).toUTCString();
}

// Feed = últimos 20 posts do locale (date desc). A rota já faz slice; o núcleo
// reaplica pra ser auto-contido (testável sem depender de quem chama).
const FEED_LIMIT = 20;

export function buildRssXml(input: {
  locale: Locale;
  posts: Post[];
  channelTitle: string;
  channelDescription: string;
}): string {
  const { locale, posts, channelTitle, channelDescription } = input;
  const items = posts.slice(0, FEED_LIMIT);
  const blogUrl = `${SITE_URL}/${locale}/blog`;
  const selfUrl = `${SITE_URL}/api/rss/${locale}.xml`;

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(channelTitle)}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>${escapeXml(channelDescription)}</description>`,
    `    <language>${HREFLANG[locale]}</language>`,
    `    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />`,
  ];

  // posts vêm date desc, então o primeiro é o mais recente. Omite se vazio.
  const newest = posts[0];
  if (newest) {
    lines.push(`    <lastBuildDate>${toRfc822(newest.date)}</lastBuildDate>`);
  }

  for (const post of items) {
    const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
    lines.push(
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${toRfc822(post.date)}</pubDate>`,
      `      <description>${escapeXml(post.description)}</description>`,
      '      <dc:creator>Renan Mocelin</dc:creator>',
    );
    for (const tag of post.tags) {
      lines.push(`      <category>${escapeXml(tag)}</category>`);
    }
    lines.push('    </item>');
  }

  lines.push('  </channel>', '</rss>', '');
  return lines.join('\n');
}

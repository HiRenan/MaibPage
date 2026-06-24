import { describe, expect, it } from 'vitest';

import type { Locale, Post } from '@/lib/posts';
import { buildRssXml } from '@/lib/rss';
import { SITE_URL } from '@/lib/seo';

// Post mínimo; cada caso sobrescreve só o que precisa (espelha seo.test.ts).
function makePost(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'hello-world',
    lang: 'pt',
    title: 'Olá, mundo',
    description: 'um post',
    date: '2026-06-21',
    tags: ['meta'],
    fallback: false,
    readingTime: 1,
    ...overrides,
  };
}

function build(posts: Post[], locale: Locale = 'pt'): string {
  return buildRssXml({
    locale,
    posts,
    channelTitle: 'MAIB — Renan Mocelin',
    channelDescription: 'Feed do blog',
  });
}

describe('buildRssXml', () => {
  it('gera um <item> por post, com URLs absolutas, guid e pubDate RFC-822', () => {
    const xml = build([
      makePost({ slug: 'a', date: '2026-06-21' }),
      makePost({ slug: 'b', date: '2026-06-20' }),
    ]);
    expect((xml.match(/<item>/g) ?? []).length).toBe(2);
    expect(xml).toContain(`<link>${SITE_URL}/pt/blog/a</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${SITE_URL}/pt/blog/a</guid>`);
    expect(xml).toContain(`<pubDate>${new Date('2026-06-21').toUTCString()}</pubDate>`);
    expect(xml).toMatch(/<pubDate>\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/);
  });

  it('inclui dc:creator, uma <category> por tag e lastBuildDate = post mais recente', () => {
    const xml = build([
      makePost({ slug: 'a', date: '2026-06-21', tags: ['meta', 'rss'] }),
      makePost({ slug: 'b', date: '2026-06-20' }),
    ]);
    expect(xml).toContain('<dc:creator>Renan Mocelin</dc:creator>');
    expect(xml).toContain('<category>meta</category>');
    expect(xml).toContain('<category>rss</category>');
    expect(xml).toContain(`<lastBuildDate>${new Date('2026-06-21').toUTCString()}</lastBuildDate>`);
  });

  it('escapa & < > " \' em title e description, sem deixar o & cru vazar', () => {
    const xml = build([makePost({ title: `A & B <c> "d" 'e'`, description: 'x & y' })]);
    expect(xml).toContain('<title>A &amp; B &lt;c&gt; &quot;d&quot; &apos;e&apos;</title>');
    expect(xml).toContain('<description>x &amp; y</description>');
    expect(xml).not.toContain('A & B');
  });

  it('mantém acentos crus (UTF-8), sem virar entidade', () => {
    const xml = build([makePost({ title: 'Programação é ótimo', description: 'ação & cia' })]);
    expect(xml).toContain('<title>Programação é ótimo</title>');
    expect(xml).toContain('<description>ação &amp; cia</description>');
  });

  it('feed vazio: XML válido, sem <item> nem <lastBuildDate>', () => {
    const xml = build([]);
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
    expect(xml).not.toContain('<item>');
    expect(xml).not.toContain('<lastBuildDate>');
  });

  it('<language> reflete o locale (pt-BR / en)', () => {
    expect(build([makePost()], 'pt')).toContain('<language>pt-BR</language>');
    expect(build([makePost({ lang: 'en' })], 'en')).toContain('<language>en</language>');
  });

  it('atom:link self aponta pro /api/rss/{locale}.xml', () => {
    expect(build([makePost()], 'pt')).toContain(
      `<atom:link href="${SITE_URL}/api/rss/pt.xml" rel="self" type="application/rss+xml" />`,
    );
    expect(build([makePost({ lang: 'en' })], 'en')).toContain(
      `<atom:link href="${SITE_URL}/api/rss/en.xml" rel="self" type="application/rss+xml" />`,
    );
  });

  it('limita a 20 itens mesmo com 21+ posts', () => {
    const posts = Array.from({ length: 25 }, (_, i) =>
      makePost({ slug: `post-${i}`, date: '2026-06-21' }),
    );
    const xml = build(posts);
    expect((xml.match(/<item>/g) ?? []).length).toBe(20);
  });
});

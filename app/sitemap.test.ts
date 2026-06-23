import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { routing } from '@/i18n/routing';
import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/seo';

describe('sitemap', () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it('inclui as rotas estáticas × locales (/, /about, /experience, /blog)', () => {
    for (const locale of routing.locales) {
      expect(urls).toContain(`${SITE_URL}/${locale}`);
      expect(urls).toContain(`${SITE_URL}/${locale}/about`);
      expect(urls).toContain(`${SITE_URL}/${locale}/experience`);
      expect(urls).toContain(`${SITE_URL}/${locale}/blog`);
    }
  });

  it('inclui posts × locales espelhando getAllPosts (fallback respeitado)', () => {
    for (const locale of routing.locales) {
      const expected = getAllPosts(locale).map((p) => `${SITE_URL}/${locale}/blog/${p.slug}`);
      const actual = urls.filter((u) => u.startsWith(`${SITE_URL}/${locale}/blog/`));
      // Igualdade de conjuntos: nenhum post a mais (cross-locale) nem a menos.
      expect(new Set(actual)).toEqual(new Set(expected));
    }
  });

  it('hello-world (simétrico) aparece nos dois locales', () => {
    expect(urls).toContain(`${SITE_URL}/pt/blog/hello-world`);
    expect(urls).toContain(`${SITE_URL}/en/blog/hello-world`);
  });

  it('entry de post simétrico lista hreflang dos dois locales + x-default', () => {
    const entry = entries.find((e) => e.url === `${SITE_URL}/pt/blog/hello-world`);
    expect(entry?.alternates?.languages).toEqual({
      'pt-BR': `${SITE_URL}/pt/blog/hello-world`,
      en: `${SITE_URL}/en/blog/hello-world`,
      'x-default': `${SITE_URL}/pt/blog/hello-world`,
    });
  });

  it('lastModified do post = data do post', () => {
    const entry = entries.find((e) => e.url === `${SITE_URL}/pt/blog/hello-world`);
    const post = getAllPosts('pt').find((p) => p.slug === 'hello-world');
    expect(entry?.lastModified).toBe(post?.date);
  });

  it('rota estática traz hreflang completo + x-default', () => {
    const entry = entries.find((e) => e.url === `${SITE_URL}/pt/about`);
    expect(entry?.alternates?.languages).toEqual({
      'pt-BR': `${SITE_URL}/pt/about`,
      en: `${SITE_URL}/en/about`,
      'x-default': `${SITE_URL}/pt/about`,
    });
  });
});

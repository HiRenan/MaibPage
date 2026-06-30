import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { getAllPosts, type Locale } from '@/lib/posts';
import { hreflangAlternates, SITE_URL } from '@/lib/seo';

// Segmentos de rota (não posts). '' = a home /[locale].
const STATIC_SEGMENTS = ['', '/about', '/experience', '/projects', '/blog'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Rotas estáticas × locales. Existem em todos os locales -> hreflang completo.
  for (const segment of STATIC_SEGMENTS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${segment}`,
        alternates: { languages: hreflangAlternates((l) => `${SITE_URL}/${l}${segment}`) },
      });
    }
  }

  // Locais onde cada slug existe (respeita fallback: getAllPosts(locale) só traz os
  // presentes naquele idioma). Ordem = routing.locales, igual às páginas.
  const localesBySlug = new Map<string, Locale[]>();
  for (const locale of routing.locales) {
    for (const post of getAllPosts(locale)) {
      localesBySlug.set(post.slug, [...(localesBySlug.get(post.slug) ?? []), locale]);
    }
  }

  // Posts × locales. lastModified = data do post; hreflang só pros locais existentes.
  for (const locale of routing.locales) {
    for (const post of getAllPosts(locale)) {
      const existing = localesBySlug.get(post.slug) ?? [locale];
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.date,
        alternates: {
          languages: hreflangAlternates((l) => `${SITE_URL}/${l}/blog/${post.slug}`, existing),
        },
      });
    }
  }

  return entries;
}

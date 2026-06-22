import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BlogList } from '@/components/blog/blog-list';
import { Container } from '@/components/ui/container';
import { routing } from '@/i18n/routing';
import { getAllPosts, getAllTags, type Locale } from '@/lib/posts';

type Props = {
  params: Promise<{ locale: string }>;
};

// hreflang por locale, espelhando o root layout (pt -> 'pt-BR', en -> 'en').
const HREFLANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'blog' });

  // O índice existe em todos os locales (é rota, não post) -> hreflang completo.
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[HREFLANG[l]] = `/${l}/blog`;
  languages['x-default'] = `/${routing.defaultLocale}/blog`;

  return {
    title: t('metaTitle'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/blog`,
      languages,
    },
    // TODO(OG): sem `images` até a fase do endpoint de OG (/api/og + opengraph-image).
    // TODO(RSS): sem <link rel="alternate" type="application/rss+xml"> até a fase do feed (/api/rss).
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const posts = getAllPosts(locale);
  const tags = getAllTags(locale);
  const t = await getTranslations();

  // Só o serializável cruza a fronteira RSC -> client (sem lang/fallback).
  const items = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    readingTime: post.readingTime,
  }));

  return (
    <Container size="prose" className="py-16 sm:py-24">
      <header>
        <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t('nav.blog')}
        </h1>
        <p className="text-muted-foreground mt-5 text-lg text-pretty">{t('blog.description')}</p>
      </header>

      <div className="mt-12">
        <BlogList posts={items} tags={tags} />
      </div>
    </Container>
  );
}

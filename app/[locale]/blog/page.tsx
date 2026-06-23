import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BlogList } from '@/components/blog/blog-list';
import { Container } from '@/components/ui/container';
import { routing } from '@/i18n/routing';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { hreflangAlternates, ogImagePath } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'blog' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  // O índice existe em todos os locales (é rota, não post) -> hreflang completo (lib/seo).
  const ogTitle = tNav('blog');

  return {
    title: t('metaTitle'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: hreflangAlternates((l) => `/${l}/blog`),
    },
    openGraph: {
      type: 'website',
      url: `/${locale}/blog`,
      images: [{ url: ogImagePath(ogTitle), width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: 'summary_large_image' },
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

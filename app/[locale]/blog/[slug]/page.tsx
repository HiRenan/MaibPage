import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import type { ComponentType } from 'react';

import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { MonoTag } from '@/components/ui/mono-tag';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { adjacentInIndex, getAllPosts, getPostBySlug, type Locale } from '@/lib/posts';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Conjunto fechado de posts, conhecido no build: SSG estrito, 404 pro resto.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({ locale, slug: post.slug })),
  );
}

// hreflang por locale, espelhando o root layout (pt -> 'pt-BR', en -> 'en').
const HREFLANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  // alternates só pros locales onde o post existe; x-default no default se ele existir.
  const existing = routing.locales.filter((l) => getPostBySlug(slug, l) != null);
  const languages: Record<string, string> = {};
  for (const l of existing) languages[HREFLANG[l]] = `/${l}/blog/${slug}`;
  const xDefault = existing.includes(routing.defaultLocale) ? routing.defaultLocale : existing[0];
  if (xDefault) languages['x-default'] = `/${xDefault}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages,
    },
    // TODO(OG): sem `images` até a fase do endpoint de OG (/api/og + opengraph-image
    // dedicados). O card já fica large_image pro endpoint futuro só preencher a imagem.
    twitter: { card: 'summary_large_image' },
  };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const posts = getAllPosts(locale);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const { previous, next } = adjacentInIndex(posts, slug);

  const t = await getTranslations();
  const format = await getFormatter();
  const formattedDate = format.dateTime(new Date(post.date), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC', // data nua YYYY-MM-DD; UTC evita deslocar -1 dia em fuso negativo.
  });

  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const hasOther = getPostBySlug(slug, otherLocale) != null;

  // Corpo MDX: o loader do @next/mdx compila o arquivo e aplica o mdx-components da
  // raiz sozinho. Prefixo/sufixo estáticos deixam o bundler montar o contexto.
  const { default: PostBody } = (await import(`@/content/posts/${slug}.${locale}.mdx`)) as {
    default: ComponentType;
  };

  return (
    <Container size="prose" className="py-16 sm:py-24">
      <article>
        <header>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="text-muted-foreground mt-5 text-lg text-pretty">{post.description}</p>

          <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm">
            <time dateTime={post.date}>{formattedDate}</time>
            <span aria-hidden>·</span>
            <span>{t('post.readingTime', { minutes: post.readingTime })}</span>
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <MonoTag size="sm">{tag}</MonoTag>
                  </li>
                ))}
              </ul>
            )}
            {hasOther && (
              <Link
                href={`/blog/${slug}`}
                locale={otherLocale}
                aria-label={t('common.switchLanguage', { target: otherLocale.toUpperCase() })}
                className="hover:text-primary ml-auto uppercase transition-colors"
              >
                {locale} → {otherLocale}
              </Link>
            )}
          </div>
        </header>

        <DashedDivider />

        <PostBody />
      </article>

      {(previous || next) && (
        <>
          <DashedDivider />
          <nav aria-label={t('nav.blog')} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {previous ? (
              <Link href={`/blog/${previous.slug}`} className="group flex flex-col gap-1">
                <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
                  ← {t('post.previous')}
                </span>
                <span className="text-foreground group-hover:text-primary text-pretty transition-colors">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col gap-1 sm:items-end sm:text-right"
              >
                <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
                  {t('post.next')} →
                </span>
                <span className="text-foreground group-hover:text-primary text-pretty transition-colors">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden />
            )}
          </nav>
        </>
      )}
    </Container>
  );
}

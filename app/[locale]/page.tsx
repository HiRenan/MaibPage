import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { FeaturedPosts } from '@/components/home/featured-posts';
import { Hero } from '@/components/home/hero';
import { JsonLd } from '@/components/json-ld';
import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { MonoTag } from '@/components/ui/mono-tag';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getFeaturedPosts, type Locale } from '@/lib/posts';
import { ogImagePath, personJsonLd } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

// Title/description/canonical/hreflang vêm do root layout. Aqui só o que falta na
// home: openGraph (type website) + card OG + twitter. og:title/og:description caem
// por fallback no title/description herdados — sem redefinir. A imagem é o card
// dinâmico (/api/og); título = posicionamento do hero, kicker fixo = maib.com.br.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'home' });

  const ogTitle = t('hero.role');

  return {
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      images: [{ url: ogImagePath(ogTitle), width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const featured = getFeaturedPosts(locale as Locale, 3);
  const tags = t.raw('about.tags') as string[];

  return (
    <Container size="sm" className="flex flex-col py-20 sm:py-28">
      <JsonLd data={personJsonLd(locale as Locale)} />
      <Hero />

      <DashedDivider className="my-12" />

      {/* Sobre curto: bio real (PRODUCT.md), lead em destaque + áreas em mono, com
          "leia mais" pra página /about (F8 — antes era rota morta). */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-foreground text-lg text-pretty sm:text-xl">{t('about.lead')}</p>
          <p className="text-muted-foreground text-pretty">{t('about.p2')}</p>
          <p className="text-muted-foreground text-pretty">{t('about.p3')}</p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <MonoTag size="sm">{tag}</MonoTag>
            </li>
          ))}
        </ul>
        <Link
          href="/about"
          className="text-muted-foreground hover:text-primary self-start font-mono text-sm underline-offset-4 transition-colors hover:underline"
        >
          {t('about.readMore')}
          <span aria-hidden> →</span>
        </Link>
      </section>

      {/* Featured só aparece se há post — evita seção (e divisor) órfãos sem conteúdo. */}
      {featured.length > 0 && (
        <>
          <DashedDivider className="my-12" />
          <FeaturedPosts posts={featured} />
        </>
      )}

      <DashedDivider className="my-12" />

      {/* CTA quieto: a pessoa puxa (hero/bio/blog), a oferta MAIB fecha aqui embaixo,
          sem hard-sell. Contato por email (mailto); sem inventar /contact. */}
      <section aria-labelledby="home-contact" className="flex flex-col gap-4">
        <h2
          id="home-contact"
          className="text-muted-foreground font-mono text-sm font-medium tracking-[0.12em]"
        >
          <span aria-hidden>▸ </span>
          {t('contact.heading')}
        </h2>
        <p className="text-muted-foreground max-w-prose text-pretty">{t('contact.body')}</p>
        <a
          href={`mailto:${t('contact.email')}`}
          className="text-foreground hover:text-primary self-start font-mono text-base underline-offset-4 transition-colors hover:underline sm:text-lg"
        >
          {t('contact.email')}
        </a>
      </section>
    </Container>
  );
}

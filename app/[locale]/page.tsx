import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { FeaturedPosts } from '@/components/home/featured-posts';
import { Hero } from '@/components/home/hero';
import { JsonLd } from '@/components/json-ld';
import { MaibBlock } from '@/components/maib-block';
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

      {/* Sobre curto: o que o blog cobre + áreas em mono, com "leia mais" pra página
          /about (F8 — antes era rota morta). Posição e prova moram no hero. */}
      <section className="flex flex-col gap-6">
        <p className="text-muted-foreground text-pretty">{t('about.p3')}</p>
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <MonoTag size="sm">{tag}</MonoTag>
            </li>
          ))}
        </ul>
        <Link
          href="/about"
          className="group text-muted-foreground hover:text-primary focus-visible:text-primary duration-base ease-out-expo self-start font-mono text-sm underline-offset-4 transition-colors hover:underline"
        >
          {t('about.readMore')}{' '}
          <span
            aria-hidden
            className="duration-base ease-out-expo inline-block transition group-hover:translate-x-1 group-focus-visible:translate-x-1"
          >
            →
          </span>
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
      <MaibBlock />
    </Container>
  );
}

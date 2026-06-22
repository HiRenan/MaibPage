import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { SocialLinks } from '@/components/social-links';
import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/lib/posts';
import { cn } from '@/lib/utils';

type Props = {
  params: Promise<{ locale: string }>;
};

// hreflang por locale, espelhando o root layout e o /blog (pt -> 'pt-BR', en -> 'en').
const HREFLANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'about' });

  // A About existe em todos os locales (é rota, não post) -> hreflang completo.
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[HREFLANG[l]] = `/${l}/about`;
  languages['x-default'] = `/${routing.defaultLocale}/about`;

  return {
    title: t('metaTitle'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/about`,
      languages,
    },
    // TODO(OG): sem `images` até /api/og + opengraph-image (MAI-521 / F12).
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('about');
  const values = t.raw('values.items') as { term: string; description: string }[];

  return (
    <Container size="sm" className="flex flex-col py-20 sm:py-28">
      <header className="flex flex-col gap-4">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg text-pretty">{t('lead')}</p>
      </header>

      <DashedDivider className="my-12" />

      {/* Bio longa: abre sem heading — é o read primário da página, igual à seção
          Sobre da home. Lead em destaque já vive no header acima. */}
      <section className="flex flex-col gap-4">
        <p className="text-muted-foreground text-pretty">{t('bio.p1')}</p>
        <p className="text-muted-foreground text-pretty">{t('bio.p2')}</p>
        <p className="text-muted-foreground text-pretty">{t('bio.p3')}</p>
      </section>

      <DashedDivider className="my-12" />

      {/* Valores: <dl> com hairlines tracejadas entre as linhas. Termo na grotesca
          (foreground), explicação numa linha (muted). Sem card, sem bullet — e o
          par termo/descrição é separado por layout, nunca por em dash no DOM. */}
      <section aria-labelledby="about-values" className="flex flex-col gap-6">
        <h2
          id="about-values"
          className="text-muted-foreground font-mono text-sm font-medium tracking-[0.12em]"
        >
          <span aria-hidden>▸ </span>
          {t('values.heading')}
        </h2>
        <dl className="flex flex-col">
          {values.map(({ term, description }, index) => (
            <div
              key={term}
              className={cn(
                'flex flex-col gap-1 py-4 sm:flex-row sm:gap-6',
                index > 0 && 'border-border border-t border-dashed',
              )}
            >
              <dt className="text-foreground shrink-0 font-medium sm:w-36">{term}</dt>
              <dd className="text-muted-foreground text-pretty">{description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <DashedDivider className="my-12" />

      {/* Jornada: 1 parágrafo, trajetória real (PRODUCT.md) — sem inventar nada. */}
      <section aria-labelledby="about-journey" className="flex flex-col gap-4">
        <h2
          id="about-journey"
          className="text-muted-foreground font-mono text-sm font-medium tracking-[0.12em]"
        >
          <span aria-hidden>▸ </span>
          {t('journey.heading')}
        </h2>
        <p className="text-muted-foreground text-pretty">{t('journey.body')}</p>
      </section>

      <DashedDivider className="my-12" />

      {/* Contato: corpo no tom da home + SocialLinks stacked (github · linkedin · email). */}
      <section aria-labelledby="about-contact" className="flex flex-col gap-4">
        <h2
          id="about-contact"
          className="text-muted-foreground font-mono text-sm font-medium tracking-[0.12em]"
        >
          <span aria-hidden>▸ </span>
          {t('contact.heading')}
        </h2>
        <p className="text-muted-foreground max-w-prose text-pretty">{t('contact.body')}</p>
        <SocialLinks variant="stacked" className="mt-1" />
      </section>
    </Container>
  );
}

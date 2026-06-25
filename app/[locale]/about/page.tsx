import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { SocialLinks } from '@/components/social-links';
import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { routing } from '@/i18n/routing';
import { hreflangAlternates, ogImagePath } from '@/lib/seo';
import { cn } from '@/lib/utils';

// Placeholder blur do avatar (MAI-547): 16x16 inlined porque /avatar.jpg vive em
// public/ (não é import estático, então o next/image não gera o blur sozinho).
const AVATAR_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBl55uDGiBJSwBZx90H2qHzJoWaNyvnZwQEAWpdVZpL5xcZGHC5Q4PXis7U2lgvVlDE7gOvOSOOaSjJ6oV1Y//Z';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'about' });

  // Rota (não post) -> existe em todos os locales -> hreflang completo (lib/seo).
  const ogTitle = t('title');

  return {
    title: t('metaTitle'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: hreflangAlternates((l) => `/${l}/about`),
    },
    openGraph: {
      type: 'website',
      url: `/${locale}/about`,
      images: [{ url: ogImagePath(ogTitle), width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('about');
  // alt do avatar = o nome (SSOT em home.hero.name); reuso evita duplicar string i18n.
  const tName = await getTranslations('home');
  const values = t.raw('values.items') as { term: string; description: string }[];

  return (
    <Container size="sm" className="flex flex-col py-20 sm:py-28">
      <header className="flex flex-col gap-4">
        <Image
          src="/avatar.jpg"
          alt={tName('hero.name')}
          width={128}
          height={128}
          placeholder="blur"
          blurDataURL={AVATAR_BLUR}
          className="border-border rounded-xl border"
        />
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

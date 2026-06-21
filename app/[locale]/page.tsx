import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Container } from '@/components/ui/container';
import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations('home');

  return (
    <Container size="sm" className="flex flex-1 flex-col justify-center gap-6 py-24">
      <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance">
        {t('title')}
      </h1>
      <p className="text-muted-foreground text-lg text-pretty">{t('subtitle')}</p>
      <p className="text-muted-foreground max-w-prose text-pretty">{t('intro')}</p>
    </Container>
  );
}

import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { MonoTag } from '@/components/ui/mono-tag';
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
  const tNav = await getTranslations('nav');

  return (
    <main className="flex min-h-dvh flex-col justify-center py-24">
      <Container size="sm" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-mono text-sm">maib.com.br</span>
          <LocaleSwitcher />
        </div>

        <DashedDivider className="my-1" />

        <h1 className="text-4xl font-semibold tracking-tight text-balance">{t('title')}</h1>
        <p className="text-muted-foreground text-lg text-pretty">{t('subtitle')}</p>
        <p className="text-muted-foreground text-pretty">{t('intro')}</p>

        <nav className="flex flex-wrap gap-2 pt-2">
          <MonoTag>{tNav('about')}</MonoTag>
          <MonoTag>{tNav('experience')}</MonoTag>
          <MonoTag>{tNav('blog')}</MonoTag>
        </nav>
      </Container>
    </main>
  );
}

import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
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
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col justify-center gap-6 px-6 py-24">
      <div className="flex items-center justify-between">
        <span className="text-foreground/60 font-mono text-sm">maib.com.br</span>
        <LocaleSwitcher />
      </div>

      <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-foreground/80 text-lg">{t('subtitle')}</p>
      <p className="text-foreground/60">{t('intro')}</p>

      <nav className="text-foreground/70 flex gap-4 font-mono text-sm">
        <span>{tNav('about')}</span>
        <span>{tNav('experience')}</span>
        <span>{tNav('blog')}</span>
      </nav>
    </main>
  );
}

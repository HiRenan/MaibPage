'use client';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// Toggles PT ↔ EN preserving the current pathname (invariant).
export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();

  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      aria-label={t('switchLanguage', { target: other.toUpperCase() })}
      className="text-foreground/60 hover:text-foreground font-mono text-sm uppercase transition-colors"
    >
      {locale} → {other}
    </button>
  );
}

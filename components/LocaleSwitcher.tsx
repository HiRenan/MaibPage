'use client';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// Toggles PT ↔ EN preserving the current pathname (invariant). The visible
// "{locale} → {other}" leads the aria-label so it's a substring of the accessible
// name (WCAG 2.5.3 Label in Name — MAI-661).
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
      aria-label={`${locale} → ${other}, ${t('switchLanguage', { target: other.toUpperCase() })}`}
      className="text-muted-foreground hover:text-primary font-mono text-sm uppercase transition-colors"
    >
      {locale} → {other}
    </button>
  );
}

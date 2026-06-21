'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/navigation';

// Error boundary do segmento [locale]. Client (exigência do Next) — recebe as
// mensagens via NextIntlClientProvider do layout. reset() re-renderiza a rota.
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  return (
    <Container size="sm" className="flex flex-1 flex-col justify-center gap-6 py-24">
      <div className="flex flex-col gap-3">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight text-balance">
          {t('title')}
        </h1>
        <p className="text-muted-foreground max-w-prose text-pretty">{t('description')}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={reset}
          variant="outline"
          className="hover:border-primary hover:text-primary"
        >
          {t('retry')}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">{t('back')}</Link>
        </Button>
      </div>
    </Container>
  );
}

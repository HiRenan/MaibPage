import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MonoTag } from '@/components/ui/mono-tag';
import { Link } from '@/i18n/navigation';

// 404 localizado, on-brand. Renderiza dentro do shell (header + footer).
// Server Component com useTranslations (padrão next-intl v4).
export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <Container size="sm" className="flex flex-1 flex-col justify-center gap-6 py-24">
      <MonoTag className="self-start">{t('code')}</MonoTag>

      <div className="flex flex-col gap-3">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight text-balance">
          {t('title')}
        </h1>
        <p className="text-muted-foreground max-w-prose text-pretty">{t('description')}</p>
      </div>

      <div>
        <Button asChild variant="outline" className="hover:border-primary hover:text-primary">
          <Link href="/">{t('back')}</Link>
        </Button>
      </div>
    </Container>
  );
}

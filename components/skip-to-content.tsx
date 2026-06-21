import { getTranslations } from 'next-intl/server';

// Pula direto pro <main id="main-content">. Escondido até receber foco por
// teclado, quando vira visível com o ring ember (a11y inegociável).
export async function SkipToContent() {
  const t = await getTranslations('a11y');

  return (
    <a
      href="#main-content"
      className="border-border bg-popover text-foreground sr-only z-50 rounded-sm border px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
    >
      {t('skipToContent')}
    </a>
  );
}

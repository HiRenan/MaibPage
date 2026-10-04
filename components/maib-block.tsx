import { getTranslations } from 'next-intl/server';

import { CONTACT_EMAIL, LINKEDIN_URL } from '@/lib/social';

const linkClass =
  'hover:text-primary focus-visible:text-primary duration-base ease-out-expo underline-offset-4 transition-colors hover:underline';

// "Trabalhar com a MAIB" (fim da home e do About): a pessoa puxa, a oferta fecha
// quieta embaixo (PRODUCT.md). Mesmo <dl> dos valores do About: termo à esquerda,
// hairline tracejada entre as linhas. A oferta é prosa (grotesca); o contato é dado
// (mono): email por extenso no mailto + LinkedIn em nova aba com aviso sr-only.
export async function MaibBlock() {
  const t = await getTranslations('maib');
  const tSocial = await getTranslations('social');
  const tA11y = await getTranslations('a11y');

  return (
    <section aria-labelledby="maib-heading" className="flex flex-col gap-6">
      <h2
        id="maib-heading"
        className="text-muted-foreground font-mono text-sm font-medium tracking-[0.12em]"
      >
        <span aria-hidden>▸ </span>
        {t('heading')}
      </h2>
      <dl className="flex flex-col">
        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
          <dt className="text-foreground shrink-0 font-medium sm:w-36">{t('offerTerm')}</dt>
          <dd className="text-muted-foreground text-pretty">{t('offer')}</dd>
        </div>
        <div className="border-border flex flex-col gap-1 border-t border-dashed py-4 sm:flex-row sm:items-baseline sm:gap-6">
          <dt className="text-foreground shrink-0 font-medium sm:w-36">{t('contactTerm')}</dt>
          {/* Mobile empilha (email + linkedin não cabem numa linha em mono largo e o
              "·" ficaria pendurado); do sm pra cima, uma linha com o separador. */}
          <dd className="flex flex-col items-start gap-1 font-mono text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2.5">
            <a href={`mailto:${CONTACT_EMAIL}`} className={`text-foreground ${linkClass}`}>
              {CONTACT_EMAIL}
            </a>
            <span aria-hidden className="text-border hidden select-none sm:inline">
              ·
            </span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-muted-foreground ${linkClass}`}
            >
              {tSocial('linkedin')}
              <span className="sr-only"> ({tA11y('opensInNewTab')})</span>
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}

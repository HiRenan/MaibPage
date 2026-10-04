import { getLocale, getTranslations } from 'next-intl/server';

import { CommandMenu } from '@/components/command-menu';
import { MaibMonogram } from '@/components/icons';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { NavLinks } from '@/components/nav-links';
import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { Link } from '@/i18n/navigation';
import { getPostCommandItems, type Locale } from '@/lib/posts';

// Chrome global topo. No mobile a nav quebra pra linha de baixo (order + wrap),
// sem hambúrguer — público é desktop-quase-sempre e são só 4 itens. Do md pra cima,
// grid 1fr·auto·1fr: a nav fica no eixo da página (o mesmo das colunas de conteúdo),
// não no meio do que sobra entre a marca e os controles. Controles em w-max: perto
// de 768px a nav sai uns px do eixo em vez de o "pt → en" quebrar em duas linhas.
export async function SiteHeader() {
  const t = await getTranslations();
  // Posts indexados no servidor (lê fs); passados como prop pra paleta client (MAI-483).
  const locale = (await getLocale()) as Locale;
  const posts = getPostCommandItems(locale);

  return (
    <header className="border-border border-b border-dashed">
      <Container
        size="lg"
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4 md:grid md:h-16 md:grid-cols-[1fr_auto_1fr] md:py-0"
      >
        {/* Lockup do card OG: monograma ember + wordmark mono. Fora de link, foco e
            estado ativo, é o único ember da página (Regra do Mono Quente: a cor
            aponta a marca). */}
        <Link
          href="/"
          aria-label={`MAIB · ${t('nav.home')}`}
          className="text-foreground hover:text-primary duration-base ease-out-expo order-1 inline-flex items-center gap-2 font-mono text-base font-semibold tracking-[0.15em] uppercase transition-colors md:justify-self-start"
        >
          <MaibMonogram className="text-primary -ml-1.5 size-7" />
          MAIB
        </Link>

        <nav aria-label={t('a11y.mainNav')} className="order-3 w-full md:order-2 md:w-auto">
          <NavLinks />
        </nav>

        <div className="order-2 flex items-center gap-3 md:order-3 md:w-max md:justify-self-end">
          <DashedDivider orientation="vertical" className="mx-0 hidden h-5 self-center md:block" />
          <LocaleSwitcher />
          <CommandMenu posts={posts} />
        </div>
      </Container>
    </header>
  );
}

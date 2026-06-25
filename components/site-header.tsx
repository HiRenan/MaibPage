import { getLocale, getTranslations } from 'next-intl/server';

import { CommandMenu } from '@/components/command-menu';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { NavLinks } from '@/components/nav-links';
import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { Link } from '@/i18n/navigation';
import { getPostCommandItems, type Locale } from '@/lib/posts';

// Chrome global topo. No mobile a nav quebra pra linha de baixo (order + wrap),
// sem hambúrguer — público é desktop-quase-sempre e são só 3 itens.
export async function SiteHeader() {
  const t = await getTranslations();
  // Posts indexados no servidor (lê fs); passados como prop pra paleta client (MAI-483).
  const locale = (await getLocale()) as Locale;
  const posts = getPostCommandItems(locale);

  return (
    <header className="border-border border-b border-dashed">
      <Container
        size="lg"
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4 md:h-16 md:flex-nowrap md:py-0"
      >
        <Link
          href="/"
          aria-label={`MAIB · ${t('nav.home')}`}
          className="text-foreground hover:text-primary order-1 font-mono text-base font-semibold tracking-[0.15em] uppercase transition-colors"
        >
          MAIB
        </Link>

        <nav aria-label={t('a11y.mainNav')} className="order-3 w-full md:order-2 md:w-auto">
          <NavLinks />
        </nav>

        <div className="order-2 flex items-center gap-3 md:order-3">
          <DashedDivider orientation="vertical" className="mx-0 hidden h-5 self-center md:block" />
          <LocaleSwitcher />
          <CommandMenu posts={posts} />
        </div>
      </Container>
    </header>
  );
}

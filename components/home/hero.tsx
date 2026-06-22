import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

// Hero da home (MAI-494). Nome grande em grotesca, role mono, sociais inline em mono
// separados por · — registro daviaviss, mas mirando AUTORIDADE, não Linktree (sem
// grade de cards, sem ícones-botão). URLs e tratamento de aba espelham o footer; a
// extração de um SocialLinks genérico é F8 (MAI-499), aqui fica inline de propósito.
export async function Hero() {
  const t = await getTranslations();
  const opensInNewTab = t('a11y.opensInNewTab');

  const socials = [
    { label: t('home.hero.social.github'), href: 'https://github.com/HiRenan', external: true },
    {
      label: t('home.hero.social.linkedin'),
      href: 'https://www.linkedin.com/in/renan-mocelin-br',
      external: true,
    },
    { label: t('home.hero.social.email'), href: 'mailto:renanryuakame@gmail.com', external: false },
  ];

  return (
    <header className="flex flex-col gap-6">
      <h1 className="text-foreground text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
        {t('home.hero.name')}
      </h1>

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground font-mono text-sm sm:text-base">
          {t('home.hero.role')}
        </p>

        <ul className="text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-sm">
          {socials.map(({ label, href, external }, index) => (
            <Fragment key={href}>
              {index > 0 && (
                <li aria-hidden className="text-border select-none">
                  ·
                </li>
              )}
              <li>
                <a
                  href={href}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="hover:text-primary underline-offset-4 transition-colors hover:underline"
                >
                  {label}
                  {external && <span className="sr-only"> ({opensInNewTab})</span>}
                </a>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </header>
  );
}

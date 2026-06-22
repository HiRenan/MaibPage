import { getTranslations } from 'next-intl/server';

import { SocialLinks } from '@/components/social-links';

// Hero da home (MAI-494). Nome grande em grotesca, role mono, sociais inline em mono
// separados por · — registro daviaviss, mirando AUTORIDADE, não Linktree (sem grade
// de cards, sem ícones-botão). As URLs e o tratamento de aba/rel vivem agora no
// SocialLinks (MAI-499), com fonte única em lib/social.ts.
export async function Hero() {
  const t = await getTranslations('home.hero');

  return (
    <header className="flex flex-col gap-6">
      <h1 className="text-foreground text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
        {t('name')}
      </h1>

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground font-mono text-sm sm:text-base">{t('role')}</p>
        <SocialLinks variant="inline" />
      </div>
    </header>
  );
}

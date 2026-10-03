import { getTranslations } from 'next-intl/server';

import { ShortcutLabel } from '@/components/shortcut-label';
import { SocialLinks } from '@/components/social-links';
import { cn } from '@/lib/utils';

type Proof = { year: string; label: string };

// Marcas de Registro nos 4 cantos da moldura (as mesmas do card OG). 12px fora do
// texto no mobile, dentro do px-6 do Container (sem overflow em 375px); 20px no desktop.
const CORNERS = {
  tl: '-top-3 -left-3 sm:-top-5 sm:-left-5',
  tr: '-top-3 -right-3 sm:-top-5 sm:-right-5',
  bl: '-bottom-3 -left-3 sm:-bottom-5 sm:-left-5',
  br: '-bottom-3 -right-3 sm:-bottom-5 sm:-right-5',
} as const;

// Hero da home (MAI-494). Nome em grotesca, role mono, a frase de posição e a prova
// como ficha técnica (ano mono + fato), sem número gigante. A entrada da home são as
// Marcas de Registro desenhando a moldura (globals.css): o texto nasce parado, então o
// h1 (LCP) não espera animação. A dica da ⌘K só aparece com ponteiro fino e é
// aria-hidden: o atalho já está no aria-keyshortcuts do botão da paleta.
export async function Hero() {
  const t = await getTranslations('home.hero');
  const proof = t.raw('proof') as Proof[];

  return (
    <header className="relative flex flex-col gap-6 sm:gap-8">
      {Object.entries(CORNERS).map(([corner, position]) => (
        <span
          key={corner}
          aria-hidden
          data-corner={corner}
          className={cn('reg-mark size-3 sm:size-4', position)}
        />
      ))}

      <div className="flex flex-col gap-3">
        <h1 className="text-foreground text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {t('name')}
        </h1>
        <p className="text-muted-foreground font-mono text-sm sm:text-base">{t('role')}</p>
      </div>

      <p className="text-foreground text-xl text-balance sm:text-2xl">{t('pov')}</p>

      <ul className="flex flex-col gap-2 font-mono text-sm">
        {proof.map(({ year, label }) => (
          <li key={label} className="grid grid-cols-[4ch_minmax(0,1fr)] gap-x-4">
            <time dateTime={year} className="text-muted-foreground tabular-nums">
              {year}
            </time>
            <span className="text-foreground">{label}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3">
        <SocialLinks />
        <p
          aria-hidden
          className="text-muted-foreground hidden items-center gap-2 font-mono text-xs pointer-fine:flex"
        >
          <ShortcutLabel className="border-border rounded-sm border px-1.5 py-0.5" />
          {t('commandHint')}
        </p>
      </div>
    </header>
  );
}

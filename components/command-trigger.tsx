'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ComponentProps, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

// Plataforma é estado externo estável (não muda em runtime): subscribe no-op,
// snapshot do servidor = ⌘K (sem hydration mismatch), cliente resolve o real.
const subscribe = () => () => {};
const getIsMac = () => /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
const getServerIsMac = () => true;

// Affordance ⌘K — casca visual da paleta, agora client e fiada ao onClick pelo
// CommandMenu. O glifo do atalho resolve por plataforma depois do hydration.
export function CommandTrigger({ className, ref, ...props }: ComponentProps<'button'>) {
  const t = useTranslations('command');
  const isMac = useSyncExternalStore(subscribe, getIsMac, getServerIsMac);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={t('open')}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 inline-flex h-8 items-center gap-2 rounded-sm border px-2 transition-colors sm:px-2.5',
        className,
      )}
      {...props}
    >
      <Search aria-hidden className="size-4" />
      <kbd className="hidden font-mono text-xs tracking-wider sm:inline-block">
        {isMac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  );
}

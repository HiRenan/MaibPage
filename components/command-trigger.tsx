import { Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

// Affordance ⌘K — casca visual da paleta. Inerte na F4; a F5 (cmdk) fia o
// handler de clique + atalho global. Mobile mostra só o ícone (sem kbd).
export async function CommandTrigger() {
  const t = await getTranslations('command');

  return (
    <button
      type="button"
      aria-label={t('open')}
      className="border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 inline-flex h-8 items-center gap-2 rounded-sm border px-2 transition-colors sm:px-2.5"
    >
      <Search aria-hidden className="size-4" />
      <kbd className="hidden font-mono text-xs tracking-wider sm:inline-block">⌘K</kbd>
    </button>
  );
}

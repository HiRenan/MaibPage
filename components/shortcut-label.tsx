'use client';

import { useSyncExternalStore } from 'react';

// Plataforma é estado externo estável (não muda em runtime): subscribe no-op,
// snapshot do servidor = ⌘K (sem hydration mismatch), cliente resolve o real.
const subscribe = () => () => {};
const getIsMac = () => /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
const getServerIsMac = () => true;

// Atalho da paleta por plataforma: ⌘K no Mac, Ctrl K no resto. Fonte única pro
// CommandTrigger (header) e pra dica do hero.
export function useShortcutLabel() {
  const isMac = useSyncExternalStore(subscribe, getIsMac, getServerIsMac);
  return isMac ? '⌘K' : 'Ctrl K';
}

// Folha client mínima pra superfícies server (o hero) mostrarem o atalho certo.
export function ShortcutLabel({ className }: { className?: string }) {
  return <kbd className={className}>{useShortcutLabel()}</kbd>;
}

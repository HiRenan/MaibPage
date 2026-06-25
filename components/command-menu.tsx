'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { CommandTrigger } from '@/components/command-trigger';
import type { PostCommandItem } from '@/lib/posts';

// A paleta é puramente client (atrás de um Dialog) e fora do caminho crítico:
// carrega só na 1ª abertura. ssr:false é permitido aqui porque o arquivo é client.
const CommandPalette = dynamic(
  () => import('@/components/command-palette').then((m) => m.CommandPalette),
  { ssr: false },
);

// Instância única da paleta ⌘K. Vive no header (não-hot file) pra evitar tocar o
// layout.tsx; fia o trigger inerte da F4 ao estado + atalho global. O Dialog
// portaliza pro body, então a posição de montagem não importa visualmente.
export function CommandMenu({ posts }: { posts: PostCommandItem[] }) {
  const [open, setOpen] = useState(false);
  // Latch: monta a paleta na 1ª interação (atalho/clique) e a mantém montada —
  // reaberturas instantâneas. Setado nos handlers, não num effect (lint:
  // react-hooks/set-state-in-effect). open só vira true por estes dois caminhos.
  const [loaded, setLoaded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // ⌘K (Mac) / Ctrl+K (Win/Linux) alterna a paleta. Esc fecha (Radix Dialog).
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setLoaded(true);
        setOpen((value) => !value);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <CommandTrigger
        ref={triggerRef}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
      />
      {loaded && (
        <CommandPalette open={open} onOpenChange={setOpen} triggerRef={triggerRef} posts={posts} />
      )}
    </>
  );
}

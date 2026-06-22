'use client';

import { useEffect, useRef, useState } from 'react';

import { CommandPalette } from '@/components/command-palette';
import { CommandTrigger } from '@/components/command-trigger';
import type { PostCommandItem } from '@/lib/posts';

// Instância única da paleta ⌘K. Vive no header (não-hot file) pra evitar tocar o
// layout.tsx; fia o trigger inerte da F4 ao estado + atalho global. O Dialog
// portaliza pro body, então a posição de montagem não importa visualmente.
export function CommandMenu({ posts }: { posts: PostCommandItem[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // ⌘K (Mac) / Ctrl+K (Win/Linux) alterna a paleta. Esc fecha (Radix Dialog).
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <CommandTrigger ref={triggerRef} onClick={() => setOpen(true)} />
      <CommandPalette open={open} onOpenChange={setOpen} triggerRef={triggerRef} posts={posts} />
    </>
  );
}

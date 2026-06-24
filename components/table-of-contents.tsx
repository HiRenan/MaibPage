'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import type { Heading } from '@/lib/posts';
import { cn } from '@/lib/utils';

// Lista de âncoras compartilhada pelos dois modos. `activeId` só é passado no
// aside (scroll-spy); no <details> mobile vem null e nada fica realçado.
function TocList({ headings, activeId }: { headings: Heading[]; activeId: string | null }) {
  return (
    <ul className="space-y-2">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;
        return (
          <li key={heading.id} className={cn(heading.depth === 3 && 'pl-3')}>
            {/* Âncora de mesma página (#id) — fragmento nativo, não rota: não usa
                o <Link> do next-intl. O scroll-mt-24 do heading dá o offset. */}
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'block text-sm leading-snug transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const t = useTranslations('post');
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // Conjunto de headings dentro da zona ativa (topo do viewport). Ativo = o
    // primeiro na ordem do documento; entre seções, conserva o último ativo.
    // rootMargin -96px no topo casa com o scroll-mt-24 (6rem) dos headings.
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = headings.find((heading) => visible.has(heading.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: '-96px 0px -66% 0px' },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [headings]);

  // Post curto não precisa de índice. (Hooks acima rodam sempre — Rules of Hooks.)
  if (headings.length < 2) return null;

  return (
    <>
      {/* Abaixo de xl: colapsável inline no topo do corpo, sem scroll-spy. */}
      <details className="border-border my-6 rounded-sm border border-dashed px-4 py-3 xl:hidden">
        <summary className="text-muted-foreground hover:text-foreground cursor-pointer font-mono text-xs tracking-wide uppercase transition-colors">
          {t('tocTitle')}
        </summary>
        <nav aria-label={t('tocAriaLabel')} className="mt-4">
          <TocList headings={headings} activeId={null} />
        </nav>
      </details>

      {/* xl+: aside na goteira direita. `absolute inset-y-0` (não só top-0) faz o
          aside cobrir toda a altura do Container relative — sem isso o <nav>
          sticky não teria curso. Out of flow → a coluna de prosa não se mexe. */}
      <aside className="absolute inset-y-0 left-full ml-8 hidden w-56 xl:block">
        <nav aria-label={t('tocAriaLabel')} className="sticky top-24">
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-wide uppercase">
            {t('tocTitle')}
          </p>
          <TocList headings={headings} activeId={activeId} />
        </nav>
      </aside>
    </>
  );
}

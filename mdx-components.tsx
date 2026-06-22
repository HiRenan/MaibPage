import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import type { ComponentPropsWithoutRef } from 'react';

import { DashedDivider } from '@/components/ui/dashed-divider';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

// Mapeia elementos MDX pros tokens do design system ("A Oficina Noturna"):
// grotesca pra ler, mono só pra sinalizar, divisor tracejado, links em ember
// SEMPRE sublinhados (significado nunca só por cor — daltônico-safe).
// Server-first: sem 'use client' (o Link do next-intl e o next/image rodam no RSC).

const linkClass = cn(
  'text-primary decoration-primary/40 font-medium underline underline-offset-2',
  'transition-colors hover:decoration-primary',
);

function MdxAnchor({ href = '', children, className, ...props }: ComponentPropsWithoutRef<'a'>) {
  // Interno: navegação locale-aware (invariante — nunca <a href> cru).
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={cn(linkClass, className)}>
        {children}
      </Link>
    );
  }

  // Externo: nova aba, rel seguro + glifo ↗ (sinal além da cor, como o ↵ na ⌘K).
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={cn(linkClass, className)}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
      {isExternal && (
        <span aria-hidden className="ml-0.5 font-mono text-sm">
          ↗
        </span>
      )}
    </a>
  );
}

function MdxImage({ src, alt = '', width, height, className }: ComponentPropsWithoutRef<'img'>) {
  if (typeof src !== 'string' || src.length === 0) return null;

  // Com width/height -> next/image normal. Sem (markdown ![]()), padrão responsivo
  // de tamanho intrínseco desconhecido (w/h 0 + sizes), proporção resolvida no CSS.
  const sized = width != null && height != null;
  return (
    <Image
      src={src}
      alt={alt}
      width={sized ? Number(width) : 0}
      height={sized ? Number(height) : 0}
      sizes={sized ? undefined : '100vw'}
      className={cn('my-6 rounded-sm', sized ? 'h-auto' : 'h-auto w-full', className)}
    />
  );
}

const components: MDXComponents = {
  h1: ({ className, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className={cn(
        'text-foreground mt-0 mb-6 scroll-mt-24 text-3xl font-semibold tracking-tight text-balance',
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className={cn(
        'text-foreground mt-12 mb-4 scroll-mt-24 text-2xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className={cn('text-foreground mt-8 mb-3 scroll-mt-24 text-xl font-medium', className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p className={cn('text-foreground my-5 leading-7 text-pretty', className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className={cn(
        'text-foreground marker:text-muted-foreground my-5 list-disc space-y-2 pl-6 leading-7',
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className={cn(
        'text-foreground marker:text-muted-foreground my-5 list-decimal space-y-2 pl-6 leading-7',
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<'li'>) => (
    <li className={cn('pl-1.5', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
    // Painel tonal, não faixa lateral colorida (ban a side-stripe). Profundidade é
    // tonal: uma camada de carvão mais clara, plana, sem sombra projetada.
    <blockquote
      className={cn(
        'bg-muted/40 text-foreground border-border my-6 rounded-sm border px-5 py-4',
        '[&>p]:my-0 [&>p+p]:mt-3',
        className,
      )}
      {...props}
    />
  ),
  hr: () => <DashedDivider />,
  a: MdxAnchor,
  pre: ({ className, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    // Superfície do bloco vem do token (keepBackground:false no rehype-pretty-code);
    // o tema shiki só colore os tokens. Reseta o "chip" do code inline aqui dentro.
    <pre
      className={cn(
        'bg-card text-foreground border-border my-6 overflow-x-auto rounded-sm border p-4 font-mono text-sm leading-relaxed',
        '[&_code]:bg-transparent [&_code]:p-0',
        className,
      )}
      {...props}
    />
  ),
  figcaption: ({ className, ...props }: ComponentPropsWithoutRef<'figcaption'>) => (
    <figcaption
      className={cn(
        'text-muted-foreground border-border border-b border-dashed pb-2 font-mono text-xs',
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<'code'>) => (
    // Code inline: chip mono em superfície tonal. Distinto por fonte + tom, não cor.
    // Dentro de <pre>, o reset acima neutraliza o chip (o bloco fica por conta do shiki).
    <code
      className={cn(
        'bg-muted text-foreground rounded-sm px-1.5 py-0.5 font-mono text-sm',
        className,
      )}
      {...props}
    />
  ),
  img: MdxImage,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

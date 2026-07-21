'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

// Figura de post com lightbox. Client por necessidade real: estado do <dialog>
// nativo (showModal/close, foco e Esc vêm de graça do platform). O backdrop é
// carvão quase opaco SEM blur: o vidro do sistema é exclusivo da ⌘+K.
// Width/height fixos (16:9) reservam o aspect ratio: zero CLS em posts com
// muitas figuras (o MdxImage de markdown não reserva).

type PostFigureProps = {
  src: string;
  alt: string; // no idioma do post
  caption?: string; // legenda curta, mono, no idioma do post
  priority?: boolean; // true só quando a figura for o LCP
};

export function PostFigure({ src, alt, caption, priority = false }: PostFigureProps) {
  const t = useTranslations('post');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false); // dialog no top layer
  const [shown, setShown] = useState(false); // classes de entrada aplicadas

  const openLightbox = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setOpen(true);
    // dupla rAF: garante um frame no estado inicial antes da transição de entrada
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };

  const closeLightbox = () => {
    // Com reduced-motion a transição não roda (sem transitionend): fecha direto.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialogRef.current?.close();
      return;
    }
    setShown(false); // transição de saída; close() dispara no transitionend
  };

  const onPanelTransitionEnd = () => {
    if (!shown) dialogRef.current?.close();
  };

  // Scroll lock enquanto o lightbox está aberto (dialog nativo não trava o fundo).
  useEffect(() => {
    if (!open) return;
    const { documentElement } = document;
    const previous = documentElement.style.overflow;
    documentElement.style.overflow = 'hidden';
    return () => {
      documentElement.style.overflow = previous;
    };
  }, [open]);

  return (
    <figure className="my-8">
      <button
        type="button"
        onClick={openLightbox}
        className="group focus-visible:outline-primary block w-full cursor-zoom-in rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="relative block">
          <Image
            src={src}
            alt={alt}
            width={1280}
            height={720}
            priority={priority}
            sizes="(max-width: 672px) 100vw, 640px"
            className="border-border group-hover:border-primary/40 group-focus-visible:border-primary/40 duration-base ease-out-expo h-auto w-full rounded-sm border transition group-hover:brightness-105"
          />
          {/* Affordance de zoom: chip mono que acende no hover E no foco (nunca
              hover-only). Decorativo pra AT: o sr-only abaixo anuncia a ação. */}
          <span
            aria-hidden
            className="text-muted-foreground border-border bg-background/85 duration-base ease-out-expo absolute top-2 right-2 rounded-sm border px-1.5 py-0.5 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            ⤢
          </span>
        </span>
        <span className="sr-only">{t('zoomFigure')}</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        onClose={() => {
          setShown(false);
          setOpen(false);
        }}
        onCancel={(event) => {
          // Esc: intercepta o fechamento nativo pra sair com a mesma transição
          event.preventDefault();
          closeLightbox();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
        className={cn(
          'm-auto max-h-none max-w-none bg-transparent p-4 sm:p-8',
          'backdrop:bg-background/95 backdrop:duration-base backdrop:transition-opacity motion-reduce:backdrop:transition-none',
          shown ? 'backdrop:opacity-100' : 'backdrop:opacity-0',
        )}
      >
        <div
          onTransitionEnd={onPanelTransitionEnd}
          className={cn(
            'duration-slow ease-out-expo transition motion-reduce:transition-none',
            shown ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0',
          )}
        >
          {/* alt vazio de propósito: o aria-label do dialog já carrega a descrição;
              alt igual duplicaria o anúncio no leitor de tela ao abrir. */}
          <Image
            src={src}
            alt=""
            width={1280}
            height={720}
            sizes="(min-width: 1440px) 1280px, 95vw"
            className="border-border max-h-[82svh] w-auto max-w-full rounded-sm border"
          />
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <p className="text-muted-foreground font-mono text-xs">{caption ?? ''}</p>
            <button
              type="button"
              onClick={closeLightbox}
              className="text-primary decoration-primary/40 hover:decoration-primary focus-visible:outline-primary duration-base ease-out-expo shrink-0 font-mono text-xs underline underline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('closeFigure')} · esc
            </button>
          </div>
        </div>
      </dialog>

      {/* figcaption por último: <figure> válido exige caption como primeiro ou
          último filho (o dialog fechado não renderiza, mas o DOM conta). */}
      {caption && (
        <figcaption className="text-muted-foreground border-border mt-3 border-b border-dashed pb-2 font-mono text-xs">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

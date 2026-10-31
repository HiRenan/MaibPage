'use client';

import { animate, cubicBezier, onScroll, stagger } from 'animejs';
import { useEffect, useRef, type ComponentProps } from 'react';

import { cssTimeToMs } from '@/lib/utils';

// Lista de chips mono que entra em cascata quando aparece na tela: cada item sobe
// 6px e acende, um depois do outro. É a exceção da Regra da Entrada Única (DESIGN.md).
// Client por necessidade real: o anime.js roda no browser. Os itens chegam do
// servidor como children; antes de hidratar eles nascem invisíveis via
// [data-cascade] no globals.css, então não há flash. Com reduced-motion a regra CSS
// não casa e aqui não anima: entrega o estático. Children fixos por montagem: item
// que entrar depois do mount fica escondido pela regra CSS.
export function CascadeList({ children, ...props }: ComponentProps<'ul'>) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Mesmos tokens da entrada-assinatura (globals.css), nada de valor mágico.
    const tokens = getComputedStyle(document.documentElement);
    const animation = animate(Array.from(list.children), {
      opacity: [0, 1],
      y: [6, 0],
      duration: cssTimeToMs(tokens.getPropertyValue('--duration-enter')),
      delay: stagger(cssTimeToMs(tokens.getPropertyValue('--cascade-stagger'))),
      ease: cubicBezier(0.16, 1, 0.3, 1), // espelha o --ease-out-expo
      // 'play': toca ao entrar e não pausa ao sair (rolagem rápida não congela no meio).
      autoplay: onScroll({ target: list, enter: 'bottom-=40 top', sync: 'play', repeat: false }),
    });

    return () => {
      animation.revert();
    };
  }, []);

  return (
    <ul {...props} ref={listRef} data-cascade="">
      {children}
    </ul>
  );
}

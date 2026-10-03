import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Hero } from '@/components/home/hero';
import messages from '@/messages/pt.json';

// Hero é server component (getTranslations do next-intl/server). O mock lê o
// home.hero real do pt.json (com .raw pra lista da prova), então chave errada quebra
// aqui. SocialLinks é RSC async com teste próprio: aqui some, e a prova fica sendo a
// única lista do hero.
vi.mock('next-intl/server', async () => {
  const { default: pt } = await import('@/messages/pt.json');
  const hero: Record<string, unknown> = pt.home.hero;
  const t = Object.assign((key: string) => hero[key], { raw: (key: string) => hero[key] });
  return { getTranslations: async () => t };
});

vi.mock('@/components/social-links', () => ({ SocialLinks: () => null }));

const hero = messages.home.hero;

describe('Hero', () => {
  it('renderiza nome, posição e a prova como ficha técnica (ano em <time>)', async () => {
    render(await Hero());

    // h1 = LCP: nasce parado, sem classe de entrada (a entrada da home são as marcas).
    const h1 = screen.getByRole('heading', { level: 1, name: hero.name });
    expect(h1.className).not.toMatch(/enter-rise/);
    expect(screen.getByText(hero.pov)).toBeInTheDocument();

    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(hero.proof.length);
    hero.proof.forEach(({ year, label }, index) => {
      const item = items[index];
      expect(item).toHaveTextContent(label);
      const time = item?.querySelector('time');
      expect(time).toHaveAttribute('datetime', year);
      expect(time).toHaveTextContent(year);
    });
  });

  it('desenha as 4 marcas de registro, escondidas da tecnologia assistiva', async () => {
    const { container } = render(await Hero());

    const marks = [...container.querySelectorAll('[data-corner]')];
    expect(marks.map((mark) => mark.getAttribute('data-corner'))).toEqual(['tl', 'tr', 'bl', 'br']);
    marks.forEach((mark) => expect(mark).toHaveAttribute('aria-hidden', 'true'));
  });

  it('a dica da ⌘K é só visual: aria-hidden e escondida sem ponteiro fino', async () => {
    render(await Hero());

    const hint = screen.getByText(hero.commandHint);
    expect(hint).toHaveAttribute('aria-hidden', 'true');
    expect(hint).toHaveClass('hidden', 'pointer-fine:flex');
    expect(hint.querySelector('kbd')).toHaveTextContent(/^(⌘K|Ctrl K)$/);
  });
});

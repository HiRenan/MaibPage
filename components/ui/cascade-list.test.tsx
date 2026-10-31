import { render, screen } from '@testing-library/react';
import { animate, onScroll } from 'animejs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CascadeList } from '@/components/ui/cascade-list';

// animejs e matchMedia chegam mockados do vitest.setup.ts.
function renderList() {
  return render(
    <CascadeList className="flex gap-2">
      <li>React</li>
      <li>Vite</li>
    </CascadeList>,
  );
}

describe('CascadeList', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('renderiza a ul com os children, a className e o data-cascade', () => {
    renderList();
    const list = screen.getByRole('list');
    expect(list).toHaveClass('flex', 'gap-2');
    expect(list).toHaveAttribute('data-cascade');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('anima os itens em cascata quando a lista entra na tela, uma vez só', () => {
    renderList();
    expect(animate).toHaveBeenCalledOnce();
    expect(vi.mocked(animate).mock.lastCall?.[0]).toEqual(screen.getAllByRole('listitem'));
    expect(onScroll).toHaveBeenCalledWith(
      // 'play' não pausa ao sair da tela; repeat false não repete ao voltar.
      expect.objectContaining({ target: screen.getByRole('list'), sync: 'play', repeat: false }),
    );
  });

  it('com reduced-motion não anima (entrega o estático)', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    renderList();
    expect(animate).not.toHaveBeenCalled();
  });

  it('desfaz a animação ao desmontar', () => {
    const { unmount } = renderList();
    const animation = vi.mocked(animate).mock.results[0]?.value;
    unmount();
    expect(animation?.revert).toHaveBeenCalledOnce();
  });
});

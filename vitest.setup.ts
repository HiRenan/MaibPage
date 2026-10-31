import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom não tem matchMedia; o CascadeList consulta prefers-reduced-motion no mount.
// Padrão: motion permitido. Teste que precisa de reduced-motion usa vi.spyOn. O guard
// é pros testes em ambiente node (sem window).
if (typeof window !== 'undefined') {
  window.matchMedia = (query: string) => ({ matches: false, media: query }) as MediaQueryList;
}

// O anime.js não roda no jsdom (sem layout nem scroll real). Mock global pra os testes
// que renderizam listas de chips; o cascade-list.test confere as chamadas.
vi.mock('animejs', () => ({
  animate: vi.fn(() => ({ revert: vi.fn() })),
  cubicBezier: vi.fn(),
  onScroll: vi.fn((params: unknown) => params),
  stagger: vi.fn((value: unknown) => value),
}));

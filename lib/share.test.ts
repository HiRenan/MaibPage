import { describe, expect, it } from 'vitest';

import { linkedinShareUrl, xShareUrl } from '@/lib/share';

describe('xShareUrl', () => {
  it('monta a intent do X com url + text encodados', () => {
    expect(xShareUrl('https://maib.com.br/pt/blog/foo', 'Olá mundo')).toBe(
      'https://twitter.com/intent/tweet?url=https%3A%2F%2Fmaib.com.br%2Fpt%2Fblog%2Ffoo&text=Ol%C3%A1%20mundo',
    );
  });

  it('encoda caracteres especiais no título e na url (espaço, acento, &, ?, /)', () => {
    const out = xShareUrl('https://maib.com.br/pt/blog/x?a=1&b=2', 'A & B? c/d — ção');
    expect(out).toContain('url=https%3A%2F%2Fmaib.com.br%2Fpt%2Fblog%2Fx%3Fa%3D1%26b%3D2');
    expect(out).toContain('text=A%20%26%20B%3F%20c%2Fd%20%E2%80%94%20%C3%A7%C3%A3o');
    // os únicos & e ? crus são os separadores de params da própria intent
    expect(out.startsWith('https://twitter.com/intent/tweet?url=')).toBe(true);
  });
});

describe('linkedinShareUrl', () => {
  it('monta a intent do LinkedIn só com a url encodada', () => {
    expect(linkedinShareUrl('https://maib.com.br/en/blog/bar')).toBe(
      'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fmaib.com.br%2Fen%2Fblog%2Fbar',
    );
  });

  it('não inclui param de texto nem outros params', () => {
    const out = linkedinShareUrl('https://maib.com.br/pt/blog/baz');
    expect(out).not.toContain('text=');
    expect(out).not.toContain('&');
  });
});

// @vitest-environment node

import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { proxy } from '@/proxy';

describe('locale routing', () => {
  it.each<Record<string, string>>([
    {},
    { 'accept-language': 'pt-BR,pt;q=0.9' },
    { 'accept-language': 'en-US,en;q=0.9' },
    { 'accept-language': 'fr-FR,fr;q=0.9' },
    { cookie: 'NEXT_LOCALE=pt' },
    { 'accept-language': 'pt-BR', cookie: 'NEXT_LOCALE=pt' },
  ])('opens the bare domain in English with headers %j', (headers) => {
    const response = proxy(new NextRequest('https://www.maib.com.br/', { headers }));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://www.maib.com.br/en');
  });

  it('preserves the path and query when adding the English locale', () => {
    const response = proxy(
      new NextRequest('https://www.maib.com.br/blog/hello-world?utm_source=github'),
    );

    expect(response.headers.get('location')).toBe(
      'https://www.maib.com.br/en/blog/hello-world?utm_source=github',
    );
  });

  it.each(['pt', 'en'])('keeps explicit /%s links in their chosen language', (locale) => {
    const url = `https://www.maib.com.br/${locale}/blog/hello-world`;
    const other = locale === 'pt' ? 'en' : 'pt';
    const response = proxy(
      new NextRequest(url, {
        headers: { 'accept-language': other, cookie: `NEXT_LOCALE=${other}` },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-request-x-next-intl-locale')).toBe(locale);
  });
});

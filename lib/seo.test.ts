import { describe, expect, it } from 'vitest';

import type { Post } from '@/lib/posts';
import {
  blogPostingJsonLd,
  hreflangAlternates,
  ogImagePath,
  ogImageUrl,
  personJsonLd,
  SITE_URL,
} from '@/lib/seo';

describe('ogImagePath / ogImageUrl', () => {
  it('monta ?title=&kicker= com encodeURIComponent (%20, não +)', () => {
    expect(ogImagePath('Engenharia de contexto')).toBe(
      '/api/og?title=Engenharia%20de%20contexto&kicker=maib.com.br',
    );
  });

  it('codifica acentos e default do kicker = maib.com.br', () => {
    expect(ogImagePath('Programação')).toBe(
      '/api/og?title=Programa%C3%A7%C3%A3o&kicker=maib.com.br',
    );
  });

  it('ogImageUrl é a versão absoluta (SITE_URL + path)', () => {
    expect(ogImageUrl('Sobre')).toBe(`${SITE_URL}/api/og?title=Sobre&kicker=maib.com.br`);
  });
});

describe('hreflangAlternates', () => {
  it('rota (todos os locales): pt-BR, en e x-default no default', () => {
    expect(hreflangAlternates((l) => `/${l}/about`)).toEqual({
      'pt-BR': '/pt/about',
      en: '/en/about',
      'x-default': '/pt/about',
    });
  });

  it('post só em pt: sem en; x-default no pt', () => {
    expect(hreflangAlternates((l) => `/${l}/blog/x`, ['pt'])).toEqual({
      'pt-BR': '/pt/blog/x',
      'x-default': '/pt/blog/x',
    });
  });

  it('post só em en (default ausente): x-default cai no primeiro existente (en)', () => {
    expect(hreflangAlternates((l) => `/${l}/blog/x`, ['en'])).toEqual({
      en: '/en/blog/x',
      'x-default': '/en/blog/x',
    });
  });
});

describe('personJsonLd', () => {
  it('Person com worksFor MAIB e sameAs = github + linkedin (sem email)', () => {
    const ld = personJsonLd('pt');
    expect(ld['@type']).toBe('Person');
    expect(ld.name).toBe('Renan Mocelin');
    expect(ld.url).toBe(SITE_URL);
    expect(ld.image).toBe(`${SITE_URL}/avatar-512.jpg`);
    expect(ld.worksFor).toMatchObject({ '@type': 'Organization', name: 'MAIB', url: SITE_URL });
    const sameAs = ld.sameAs as string[];
    expect(sameAs).toContain('https://github.com/HiRenan');
    expect(sameAs).toContain('https://www.linkedin.com/in/renan-mocelin-br');
    expect(sameAs.some((href) => href.startsWith('mailto:'))).toBe(false);
  });

  it('jobTitle é locale-aware', () => {
    expect(personJsonLd('pt').jobTitle).toBe('Engenheiro de IA');
    expect(personJsonLd('en').jobTitle).toBe('AI Engineer');
  });
});

describe('blogPostingJsonLd', () => {
  const post: Post = {
    slug: 'hello-world',
    lang: 'pt',
    title: 'Olá, mundo',
    description: 'um post',
    date: '2026-06-21',
    tags: ['meta', 'build-in-public'],
    fallback: false,
    readingTime: 1,
  };

  it('BlogPosting com campos do post + image OG absoluta + canonical', () => {
    const ld = blogPostingJsonLd(post, 'pt');
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.headline).toBe('Olá, mundo');
    expect(ld.description).toBe('um post');
    expect(ld.datePublished).toBe('2026-06-21');
    expect(ld.inLanguage).toBe('pt-BR');
    expect(ld.author).toMatchObject({ '@type': 'Person', name: 'Renan Mocelin' });
    expect(ld.image).toBe(ogImageUrl('Olá, mundo'));
    expect(ld.image as string).toContain('/api/og?title=');
    expect(ld.mainEntityOfPage).toBe(`${SITE_URL}/pt/blog/hello-world`);
    expect(ld.keywords).toEqual(['meta', 'build-in-public']);
  });

  it('inLanguage segue o locale (en -> en)', () => {
    expect(blogPostingJsonLd(post, 'en').inLanguage).toBe('en');
  });
});

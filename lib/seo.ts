import { routing } from '@/i18n/routing';
import type { Locale, Post } from '@/lib/posts';
import { socialLinks } from '@/lib/social';

// SSOT de SEO: URL pública, alternates hreflang (antes duplicados nas páginas) e os
// builders de JSON-LD. Tudo server-side e puro/testável; sem cor/string de UI aqui.

// Base absoluta pro canonical, OG e sitemap. Sem barra final pra concatenar limpo.
// Espelha o metadataBase do root layout (mesmo env) — relativo resolve absoluto lá.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

// Mapa locale -> código hreflang. Era repetido em about/experience/blog/[slug] (D5).
export const HREFLANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

// Constrói o mapa de alternates (hreflang + x-default) pra um segmento, espelhando
// exatamente a lógica que vivia nas páginas — mesma ordem de chaves, HTML idêntico.
// `locales` default = todos (rotas); pra um post, passe só os locais onde ele existe.
export function hreflangAlternates(
  pathFor: (locale: Locale) => string,
  locales: Locale[] = [...routing.locales],
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[HREFLANG[locale]] = pathFor(locale);
  const xDefault = locales.includes(routing.defaultLocale) ? routing.defaultLocale : locales[0];
  if (xDefault) languages['x-default'] = pathFor(xDefault);
  return languages;
}

// kicker fixo do card (a marca; o título varia por página/post). Contrato F12.
const OG_KICKER = 'maib.com.br';

// Path relativo do endpoint de OG (MAI-521). No metadata resolve absoluto via
// metadataBase; pro JSON-LD use ogImageUrl (absoluto). encodeURIComponent -> %20,
// casando com o contrato do route handler (?title=&kicker=).
export function ogImagePath(title: string, kicker: string = OG_KICKER): string {
  return `/api/og?title=${encodeURIComponent(title)}&kicker=${encodeURIComponent(kicker)}`;
}

export function ogImageUrl(title: string, kicker: string = OG_KICKER): string {
  return `${SITE_URL}${ogImagePath(title, kicker)}`;
}

// jobTitle do Person (JSON-LD, não UI): metadado estruturado, locale-aware. Reflete
// o papel canônico do PRODUCT.md / hero.role, sem o sufixo "· MAIB".
const JOB_TITLE: Record<Locale, string> = { pt: 'Engenheiro de IA', en: 'AI Engineer' };

// schema.org/Person pra HOME. sameAs = perfis externos (github + linkedin; o email
// é external:false e fica de fora). worksFor = a MAIB (marca do site).
export function personJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Renan Mocelin',
    url: SITE_URL,
    // Foto do Person (MAI-547): 512 quadrado absoluto. Sinal estruturado pro Google
    // (knowledge panel); não toca o card OG visual nem o favicon, que seguem a marca.
    image: `${SITE_URL}/avatar-512.jpg`,
    jobTitle: JOB_TITLE[locale],
    worksFor: { '@type': 'Organization', name: 'MAIB', url: SITE_URL },
    sameAs: socialLinks.filter((link) => link.external).map((link) => link.href),
  };
}

// schema.org/BlogPosting por post. image = OG do post (absoluto); mainEntityOfPage =
// canonical absoluto; inLanguage no código hreflang; keywords = tags.
export function blogPostingJsonLd(post: Post, locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: HREFLANG[locale],
    author: { '@type': 'Person', name: 'Renan Mocelin', url: SITE_URL },
    image: ogImageUrl(post.title),
    mainEntityOfPage: `${SITE_URL}/${locale}/blog/${post.slug}`,
    keywords: post.tags,
  };
}

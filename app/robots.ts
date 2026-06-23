import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

// Allow geral + sitemap. NÃO bloqueamos /api de propósito: o card OG vive em
// /api/og e os bots de unfurl do X/LinkedIn respeitam robots.txt — um disallow
// aqui sumiria com a imagem de compartilhamento.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

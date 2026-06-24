import { getTranslations } from 'next-intl/server';

import { getAllPosts } from '@/lib/posts';
import { buildRssXml } from '@/lib/rss';

export const dynamic = 'force-static';

export async function GET() {
  const locale = 'pt';
  const t = await getTranslations({ locale, namespace: 'meta' });
  const xml = buildRssXml({
    locale,
    posts: getAllPosts(locale).slice(0, 20),
    channelTitle: t('title'),
    channelDescription: t('description'),
  });
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

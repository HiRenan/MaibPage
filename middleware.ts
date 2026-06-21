import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

// Detects the locale (Accept-Language on first visit) and rewrites/redirects
// to the locale-prefixed path. Default localePrefix is 'always' → /pt, /en.
export default createMiddleware(routing);

export const config = {
  // Skip Next.js internals, the /api folder, /_vercel and any file with an
  // extension (e.g. favicon.ico, og images).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};

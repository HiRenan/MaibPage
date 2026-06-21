import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

// Next 16 renamed the `middleware` convention to `proxy` (nodejs-only runtime,
// no edge). next-intl's middleware runs fine on nodejs — aligned with our
// Vercel Fluid Compute / Node target (D5). Exported as the named `proxy`.
export const proxy = createMiddleware(routing);

export const config = {
  // Skip Next.js internals, /api, /_vercel, any file with an extension, and the
  // extensionless `apple-icon` metadata route (else the proxy prefixes a locale
  // and the apple-touch-icon 404s). icon.svg/manifest.webmanifest have a dot.
  matcher: '/((?!api|_next|_vercel|apple-icon|.*\\..*).*)',
};

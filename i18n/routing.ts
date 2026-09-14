import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pt', 'en'],
  defaultLocale: 'en',
  // Unprefixed URLs always open in English; /pt remains an explicit choice.
  localeDetection: false,
});

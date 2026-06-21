import { routing } from '@/i18n/routing';
import messages from './messages/pt.json';

// Type-safe locales + message keys across the app (next-intl AppConfig).
// pt.json is the source of truth for the Messages shape (i18n simétrico).
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

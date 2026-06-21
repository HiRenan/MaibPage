import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

// Locale-aware wrappers around Next.js navigation APIs.
// Always use these for internal navigation (invariant: never raw <a href>).
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

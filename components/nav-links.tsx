'use client';

import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const items = [
  { href: '/about', key: 'about' },
  { href: '/experience', key: 'experience' },
  { href: '/blog', key: 'blog' },
] as const;

// Nav principal. Client por causa do usePathname (estado ativo). Item ativo
// sinaliza por cor + peso + aria-current — nunca só por cor (daltônico-safe).
export function NavLinks() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-4 sm:gap-6">
      {items.map(({ href, key }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'text-sm transition-colors',
                active ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

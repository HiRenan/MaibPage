'use client';

import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const items = [
  { href: '/about', key: 'about' },
  { href: '/experience', key: 'experience' },
  { href: '/projects', key: 'projects' },
  { href: '/blog', key: 'blog' },
] as const;

// Nav principal. Client por causa do usePathname (estado ativo). Item ativo
// sinaliza por cor + peso + aria-current — nunca só por cor (daltônico-safe).
// flex-wrap: com espaçamento de texto aumentado (WCAG 1.4.12), em 320px o "Blog"
// desce de linha em vez de vazar da tela.
export function NavLinks() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-6">
      {items.map(({ href, key }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'duration-base ease-out-expo relative text-sm transition-colors',
                // Underline animado por pseudo-elemento: transform-only (scale-x,
                // origem à esquerda), nunca width — física do vocabulário.
                'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current',
                'after:duration-base after:ease-out-expo after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100',
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

import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import { socialLinks } from '@/lib/social';
import { cn } from '@/lib/utils';

type SocialLinksProps = {
  variant: 'inline' | 'stacked';
  className?: string;
};

// Links sociais do Renan, fonte única em lib/social.ts (MAI-499). Server component:
// labels mono curtas, externos abrem em nova aba com rel seguro + dica sr-only; o
// mailto não é externo (sem target). `inline` -> linha separada por "·" (Hero);
// `stacked` -> lista vertical (contato da About).
export async function SocialLinks({ variant, className }: SocialLinksProps) {
  const t = await getTranslations('social');
  const tA11y = await getTranslations('a11y');
  const opensInNewTab = tA11y('opensInNewTab');

  const inline = variant === 'inline';

  return (
    <ul
      className={cn(
        'text-muted-foreground font-mono text-sm',
        inline ? 'flex flex-wrap items-center gap-x-2.5 gap-y-1' : 'flex flex-col gap-2',
        className,
      )}
    >
      {socialLinks.map(({ key, href, external }, index) => (
        <Fragment key={key}>
          {inline && index > 0 && (
            <li aria-hidden className="text-border select-none">
              ·
            </li>
          )}
          <li>
            <a
              href={href}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              className="hover:text-primary underline-offset-4 transition-colors hover:underline"
            >
              {t(key)}
              {external && <span className="sr-only"> ({opensInNewTab})</span>}
            </a>
          </li>
        </Fragment>
      ))}
    </ul>
  );
}

import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import { socialLinks } from '@/lib/social';

// Links sociais do Renan, fonte única em lib/social.ts (MAI-499). Server component:
// labels mono curtas, externos abrem em nova aba com rel seguro + dica sr-only; o
// mailto não é externo (sem target). Linha separada por "·" (Hero).
export async function SocialLinks() {
  const t = await getTranslations('social');
  const tA11y = await getTranslations('a11y');
  const opensInNewTab = tA11y('opensInNewTab');

  return (
    <ul className="text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-sm">
      {socialLinks.map(({ key, href, external }, index) => (
        <Fragment key={key}>
          {index > 0 && (
            <li aria-hidden className="text-border select-none">
              ·
            </li>
          )}
          <li>
            <a
              href={href}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              className="hover:text-primary duration-base ease-out-expo underline-offset-4 transition-colors hover:underline"
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

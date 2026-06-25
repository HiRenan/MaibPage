'use client';

import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LinkedinIcon, XIcon } from '@/components/icons';
import { linkedinShareUrl, xShareUrl } from '@/lib/share';
import { cn } from '@/lib/utils';

type ShareLinksProps = { url: string; title: string };

// Mesma classe da social-row do footer (site-footer.tsx): alvo de toque size-9, icon-only,
// rótulo via aria-label. O estado copiado realça em text-primary (sem neon).
const action =
  'text-muted-foreground hover:text-primary inline-flex size-9 items-center justify-center rounded-sm transition-colors';

export function ShareLinks({ url, title }: ShareLinksProps) {
  const t = useTranslations('post');
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível (sem permissão / contexto inseguro) — no-op silencioso
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
        {t('share')}
      </span>
      <ul className="-mx-2 flex items-center gap-1">
        <li>
          <a
            href={xShareUrl(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('shareOnX')}
            className={action}
          >
            <XIcon className="size-[18px]" />
          </a>
        </li>
        <li>
          <a
            href={linkedinShareUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('shareOnLinkedin')}
            className={action}
          >
            <LinkedinIcon className="size-[18px]" />
          </a>
        </li>
        <li>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? t('linkCopied') : t('copyLink')}
            className={cn(action, copied && 'text-primary')}
          >
            {copied ? <Check className="size-[18px]" /> : <Copy className="size-[18px]" />}
          </button>
        </li>
      </ul>
      <span aria-live="polite" className="sr-only">
        {copied ? t('linkCopied') : ''}
      </span>
    </div>
  );
}

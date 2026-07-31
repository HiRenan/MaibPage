import { ChartLine } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { GithubIcon, LinkedinIcon, MailIcon, RssIcon } from '@/components/icons';
import { Container } from '@/components/ui/container';
import { socialLinks, type SocialKey } from '@/lib/social';

// Chrome global base. Sociais + RSS + copyright. As URLs sociais vêm de lib/social.ts
// (MAI-499, fonte única); o RSS aponta pro feed do locale (/api/rss/{locale}.xml). O footer
// mantém os ÍCONES e os aria-labels descritivos de footer.social.* — não vira texto.
const ICONS: Record<SocialKey, typeof GithubIcon> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: MailIcon,
};

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const locale = await getLocale();
  const year = new Date().getFullYear();
  const analyticsShareUrl = process.env.NEXT_PUBLIC_UMAMI_SHARE_URL;

  return (
    <footer className="border-border border-t border-dashed">
      <Container
        size="lg"
        className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-1">
          <p className="text-muted-foreground text-sm">
            © {year} MAIB. {t('rights')}
          </p>
          {analyticsShareUrl ? (
            <a
              href={analyticsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={t('social.analytics')}
              aria-label={t('social.analytics')}
              className="text-muted-foreground hover:text-primary hover:bg-accent focus-visible:bg-accent duration-base ease-out-expo inline-flex size-9 shrink-0 items-center justify-center rounded-sm transition-colors"
            >
              <ChartLine aria-hidden="true" className="size-[18px]" />
            </a>
          ) : null}
        </div>

        <ul className="-mx-2 flex items-center gap-1">
          {socialLinks.map(({ key, href, external }) => {
            const Icon = ICONS[key];
            return (
              <li key={key}>
                <a
                  href={href}
                  aria-label={t(`social.${key}`)}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="text-muted-foreground hover:text-primary hover:bg-accent focus-visible:bg-accent duration-base ease-out-expo inline-flex size-9 items-center justify-center rounded-sm transition-colors"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            );
          })}
          <li>
            <a
              href={`/api/rss/${locale}.xml`}
              aria-label={t('social.rss')}
              className="text-muted-foreground hover:text-primary hover:bg-accent focus-visible:bg-accent duration-base ease-out-expo inline-flex size-9 items-center justify-center rounded-sm transition-colors"
            >
              <RssIcon className="size-[18px]" />
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}

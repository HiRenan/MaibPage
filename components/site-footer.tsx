import { getTranslations } from 'next-intl/server';

import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/icons';
import { Container } from '@/components/ui/container';
import { socialLinks, type SocialKey } from '@/lib/social';

// Chrome global base. Sociais + copyright. Slot de RSS reservado pra F13 (feed).
// As URLs vêm de lib/social.ts (MAI-499, fonte única); o footer mantém os ÍCONES
// e os aria-labels descritivos de footer.social.* — não vira texto.
const ICONS: Record<SocialKey, typeof GithubIcon> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: MailIcon,
};

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-border border-t border-dashed">
      <Container
        size="lg"
        className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-muted-foreground text-sm">
          © {year} MAIB. {t('rights')}
        </p>

        <ul className="-mx-2 flex items-center gap-1">
          {socialLinks.map(({ key, href, external }) => {
            const Icon = ICONS[key];
            return (
              <li key={key}>
                <a
                  href={href}
                  aria-label={t(`social.${key}`)}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="text-muted-foreground hover:text-primary inline-flex size-9 items-center justify-center rounded-sm transition-colors"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            );
          })}
          {/* RSS slot reservado pra F13 */}
        </ul>
      </Container>
    </footer>
  );
}

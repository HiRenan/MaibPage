import { getTranslations } from 'next-intl/server';

import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/icons';
import { Container } from '@/components/ui/container';

// Chrome global base. Sociais + copyright. Slot de RSS reservado pra F13 (feed).
export async function SiteFooter() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  const socials = [
    {
      href: 'https://github.com/HiRenan',
      label: t('social.github'),
      Icon: GithubIcon,
      external: true,
    },
    {
      href: 'https://www.linkedin.com/in/renan-mocelin-br',
      label: t('social.linkedin'),
      Icon: LinkedinIcon,
      external: true,
    },
    {
      href: 'mailto:renanryuakame@gmail.com',
      label: t('social.email'),
      Icon: MailIcon,
      external: false,
    },
  ];

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
          {socials.map(({ href, label, Icon, external }) => (
            <li key={href}>
              <a
                href={href}
                aria-label={label}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="text-muted-foreground hover:text-primary inline-flex size-9 items-center justify-center rounded-sm transition-colors"
              >
                <Icon className="size-[18px]" />
              </a>
            </li>
          ))}
          {/* RSS slot reservado pra F13 */}
        </ul>
      </Container>
    </footer>
  );
}

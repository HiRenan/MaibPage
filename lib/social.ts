// Fonte única das URLs sociais do Renan (MAI-499). Antes duplicadas em hero.tsx e
// site-footer.tsx; agora Hero (texto), Footer (ícones) e a página About consomem daqui.
// SEM X: github · linkedin · email é o conjunto canônico (coerência com o Hero e o
// PRODUCT.md anti dev-influencer). `external: false` no mailto -> sem target=_blank.

export type SocialKey = 'github' | 'linkedin' | 'email';

export type SocialLink = {
  key: SocialKey;
  href: string;
  external: boolean;
};

// Email e LinkedIn também aparecem por extenso no bloco da MAIB (MaibBlock).
export const CONTACT_EMAIL = 'renanryuakame@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/renan-mocelin-br';

export const socialLinks: SocialLink[] = [
  { key: 'github', href: 'https://github.com/HiRenan', external: true },
  { key: 'linkedin', href: LINKEDIN_URL, external: true },
  { key: 'email', href: `mailto:${CONTACT_EMAIL}`, external: false },
];

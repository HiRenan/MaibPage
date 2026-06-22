import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SocialLinks } from '@/components/social-links';

// SocialLinks é server component (getTranslations do next-intl/server). Mockamos a
// fronteira RSC com um dicionário síncrono por namespace; o teste prova o contrato
// (labels, hrefs canônicos, a11y de aba externa), não a tradução. Render via
// `await SocialLinks(...)` — RSC async não passa pelo render() direto.
vi.mock('next-intl/server', () => {
  const dict: Record<string, Record<string, string>> = {
    social: { github: 'github', linkedin: 'linkedin', email: 'email' },
    a11y: { opensInNewTab: 'abre em nova aba' },
  };
  return {
    getTranslations: async (namespace: 'social' | 'a11y') => (key: string) =>
      dict[namespace]?.[key] ?? key,
  };
});

describe('SocialLinks', () => {
  it.each(['inline', 'stacked'] as const)(
    'renderiza github · linkedin · email (sem X), hrefs canônicos e a11y de aba — variante %s',
    async (variant) => {
      const { unmount } = render(await SocialLinks({ variant }));

      const github = screen.getByRole('link', { name: /github/i });
      const linkedin = screen.getByRole('link', { name: /linkedin/i });
      const email = screen.getByRole('link', { name: /email/i });

      // Fonte única lib/social.ts: as 3 URLs canônicas.
      expect(github).toHaveAttribute('href', 'https://github.com/HiRenan');
      expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/renan-mocelin-br');
      expect(email).toHaveAttribute('href', 'mailto:renanryuakame@gmail.com');

      // Exatamente 3 links — SEM X / twitter.
      expect(screen.getAllByRole('link')).toHaveLength(3);
      expect(screen.queryByRole('link', { name: /twitter/i })).toBeNull();
      expect(screen.queryByText('x')).toBeNull();

      // Externos (github, linkedin): nova aba + rel seguro + dica sr-only.
      for (const external of [github, linkedin]) {
        expect(external).toHaveAttribute('target', '_blank');
        expect(external.getAttribute('rel')).toContain('noopener');
      }
      const hints = screen.getAllByText(/abre em nova aba/);
      expect(hints).toHaveLength(2);
      hints.forEach((hint) => expect(hint).toHaveClass('sr-only'));

      // mailto NÃO é externo: sem target, sem dica de nova aba.
      expect(email).not.toHaveAttribute('target');

      unmount();
    },
  );
});

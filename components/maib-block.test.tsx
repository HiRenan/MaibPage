import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MaibBlock } from '@/components/maib-block';
import { CONTACT_EMAIL, LINKEDIN_URL } from '@/lib/social';
import messages from '@/messages/pt.json';

// MaibBlock é server component: o mock resolve cada namespace no pt.json real, então
// chave errada quebra aqui. Render via `await MaibBlock()` (RSC async).
vi.mock('next-intl/server', async () => {
  const { default: pt } = await import('@/messages/pt.json');
  return {
    getTranslations: async (namespace: 'maib' | 'social' | 'a11y') => (key: string) =>
      (pt[namespace] as Record<string, string>)[key] ?? key,
  };
});

describe('MaibBlock', () => {
  it('é uma seção rotulada pelo título, com "O que faz" e "Contato"', async () => {
    render(await MaibBlock());

    const section = screen.getByRole('region', { name: messages.maib.heading });
    expect(
      within(section)
        .getAllByRole('term')
        .map((term) => term.textContent),
    ).toEqual([messages.maib.offerTerm, messages.maib.contactTerm]);
    expect(within(section).getByText(messages.maib.offer)).toBeInTheDocument();
  });

  it('contato: email por extenso no mailto e LinkedIn em nova aba, sem GitHub', async () => {
    render(await MaibBlock());

    // O texto visível do email é o próprio endereço do href.
    const email = screen.getByRole('link', { name: CONTACT_EMAIL });
    expect(email).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`);
    expect(email).not.toHaveAttribute('target');

    const linkedin = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedin).toHaveAttribute('href', LINKEDIN_URL);
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin.getAttribute('rel')).toContain('noopener');
    expect(within(linkedin).getByText(/abre em nova aba/)).toHaveClass('sr-only');

    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.queryByRole('link', { name: /github/i })).toBeNull();
  });
});

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SiteFooter } from '@/components/site-footer';

const messages: Record<string, string> = {
  rights: 'Todos os direitos reservados.',
  'social.github': 'Perfil do Renan no GitHub',
  'social.linkedin': 'Perfil do Renan no LinkedIn',
  'social.email': 'Enviar email para o Renan',
  'social.rss': 'Assinar o feed RSS',
  'social.analytics': 'Ver estatísticas públicas do site (abre em nova aba)',
};

vi.mock('next-intl/server', () => ({
  getLocale: async () => 'pt',
  getTranslations: async () => (key: string) => messages[key] ?? key,
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('SiteFooter', () => {
  it('renderiza o link público do Umami com contrato externo e a11y', async () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_SHARE_URL', 'https://cloud.umami.is/share/public-maib');

    render(await SiteFooter());

    const analytics = screen.getByRole('link', {
      name: 'Ver estatísticas públicas do site (abre em nova aba)',
    });
    expect(analytics).toHaveAttribute('href', 'https://cloud.umami.is/share/public-maib');
    expect(analytics).toHaveAttribute('target', '_blank');
    expect(analytics.getAttribute('rel')).toContain('noopener');
    expect(analytics).toHaveAttribute(
      'title',
      'Ver estatísticas públicas do site (abre em nova aba)',
    );
    expect(analytics.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    expect(screen.getByRole('link', { name: 'Perfil do Renan no GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Assinar o feed RSS' })).toHaveAttribute(
      'href',
      '/api/rss/pt.xml',
    );
  });

  it('omite o link público quando a Share URL não está configurada', async () => {
    render(await SiteFooter());

    expect(screen.queryByRole('link', { name: /estatísticas públicas/i })).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });
});

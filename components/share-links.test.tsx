import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ShareLinks } from '@/components/share-links';

const messages = {
  post: {
    share: 'Compartilhar',
    shareOnX: 'Compartilhar no X',
    shareOnLinkedin: 'Compartilhar no LinkedIn',
    copyLink: 'Copiar link',
    linkCopied: 'Link copiado',
  },
};

const POST_URL = 'https://maib.com.br/pt/blog/foo';
const POST_TITLE = 'Olá mundo';

function renderWithIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="pt" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe('ShareLinks', () => {
  it('renderiza os 3 controles com as intents e atributos certos', () => {
    renderWithIntl(<ShareLinks url={POST_URL} title={POST_TITLE} />);

    const x = screen.getByRole('link', { name: 'Compartilhar no X' });
    expect(x).toHaveAttribute(
      'href',
      'https://twitter.com/intent/tweet?url=https%3A%2F%2Fmaib.com.br%2Fpt%2Fblog%2Ffoo&text=Ol%C3%A1%20mundo',
    );
    expect(x).toHaveAttribute('target', '_blank');
    expect(x.getAttribute('rel')).toContain('noopener');

    const linkedin = screen.getByRole('link', { name: 'Compartilhar no LinkedIn' });
    expect(linkedin).toHaveAttribute(
      'href',
      'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fmaib.com.br%2Fpt%2Fblog%2Ffoo',
    );
    expect(linkedin).toHaveAttribute('target', '_blank');

    expect(screen.getByRole('button', { name: 'Copiar link' })).toBeInTheDocument();
  });

  it('copia a url no clique e troca o aria-label pra "Link copiado"', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    renderWithIntl(<ShareLinks url={POST_URL} title={POST_TITLE} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copiar link' }));

    expect(writeText).toHaveBeenCalledWith(POST_URL);
    expect(await screen.findByRole('button', { name: 'Link copiado' })).toBeInTheDocument();
  });
});

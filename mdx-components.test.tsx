import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useMDXComponents } from '@/mdx-components';

// Mockamos a fronteira de navegação: o teste prova que o link INTERNO passa pelo
// Link locale-aware (nunca <a> cru) e o externo não. A correção do next-intl é dele.
vi.mock('@/i18n/navigation', () => ({
  Link: function MockLink({ href, children, ...rest }: ComponentPropsWithoutRef<'a'>) {
    return (
      <a data-intl-link="" href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

// MdxAnchor lê a11y.opensInNewTab via useTranslations (RSC). No teste, o provider
// client entrega as mensagens síncronas.
const messages = { a11y: { opensInNewTab: 'abre em nova aba' } };
function renderWithIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="pt" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

// useMDXComponents é um acessor estático do Next (retorna um objeto fixo), não um hook.
// eslint-disable-next-line react-hooks/rules-of-hooks
const components = useMDXComponents();
const Hr = components.hr as ComponentType;
const Anchor = components.a as ComponentType<{ href: string; children: ReactNode }>;

describe('mdx-components', () => {
  it('mapeia <hr> pro DashedDivider (separator tracejado)', () => {
    render(<Hr />);
    const separator = screen.getByRole('separator');
    expect(separator.className).toContain('border-dashed');
  });

  it('roteia link interno pelo Link locale-aware (não <a> cru)', () => {
    renderWithIntl(<Anchor href="/about">sobre</Anchor>);
    const link = screen.getByRole('link', { name: 'sobre' });
    expect(link).toHaveAttribute('data-intl-link'); // passou pelo Link do next-intl
    expect(link).toHaveAttribute('href', '/about');
    expect(link.className).toContain('underline'); // daltônico-safe: não só por cor
  });

  it('abre link externo em nova aba com rel seguro + dica sr-only, fora do Link', () => {
    renderWithIntl(<Anchor href="https://github.com/HiRenan/MaibPage">repo</Anchor>);
    const link = screen.getByRole('link', { name: /repo/ });
    expect(link).not.toHaveAttribute('data-intl-link'); // não passou pelo Link
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
    // a11y: leitor de tela sabe que abre nova aba (texto sr-only, não só o glifo ↗).
    expect(screen.getByText('abre em nova aba')).toHaveClass('sr-only');
  });
});

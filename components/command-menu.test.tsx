import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { CommandMenu } from '@/components/command-menu';
import messages from '@/messages/pt.json';

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/blog',
}));

// Apenas o carregamento dinâmico é substituído; os testes usam a paleta real.
vi.mock('next/dynamic', async () => {
  const { CommandPalette } = await import('@/components/command-palette');
  return { default: () => CommandPalette };
});

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

afterAll(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
});

beforeEach(() => vi.clearAllMocks());

function renderMenu() {
  render(
    <NextIntlClientProvider locale="pt" messages={messages}>
      <CommandMenu
        posts={[
          {
            slug: 'analytics',
            href: '/blog/analytics',
            title: 'Umami instrumentado',
            date: '2026-09-11',
            tags: ['telemetria'],
          },
        ]}
      />
    </NextIntlClientProvider>,
  );
  return screen.getByRole('button', { name: /Abrir paleta/ });
}

describe('CommandMenu', () => {
  it('só monta o diálogo depois da primeira abertura', () => {
    const trigger = renderMenu();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it.each(['ctrlKey', 'metaKey'] as const)(
    'limpa a busca ao fechar e reabrir pelo atalho com %s',
    async (modifier) => {
      const trigger = renderMenu();
      const shortcut = { key: 'k', [modifier]: true };
      fireEvent.keyDown(document, shortcut);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzzxqnotfound' } });
      expect(screen.getByText(messages.command.empty)).toBeVisible();

      fireEvent.keyDown(document, shortcut);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(trigger).toHaveFocus();

      fireEvent.keyDown(document, shortcut);
      expect(screen.getByRole('combobox')).toHaveValue('');
      expect(screen.getByRole('option', { name: /Umami instrumentado/ })).toBeVisible();
    },
  );

  it('limpa a busca com Escape e devolve o foco ao botão', async () => {
    const trigger = renderMenu();
    fireEvent.click(trigger);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzzxqnotfound' } });
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());

    fireEvent.click(trigger);
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('filtra por tag, navega por Enter e reabre sem o filtro', async () => {
    const trigger = renderMenu();
    fireEvent.click(trigger);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'telemetria' } });
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(router.push).toHaveBeenCalledWith('/blog/analytics');
    await waitFor(() => expect(trigger).toHaveFocus());

    fireEvent.click(trigger);
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('preserva o pathname na troca de idioma e fecha a paleta', async () => {
    const trigger = renderMenu();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('option', { name: /Mudar idioma/ }));
    expect(router.replace).toHaveBeenCalledWith('/blog', { locale: 'en' });
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('mantém os divisores decorativos fora da árvore acessível do listbox', () => {
    fireEvent.click(renderMenu());
    const listbox = screen.getByRole('listbox');
    const separators = within(listbox).getAllByRole('separator', { hidden: true });
    expect(separators).toHaveLength(2);
    for (const separator of separators) expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(within(listbox).queryByRole('separator')).not.toBeInTheDocument();
    expect(within(listbox).getAllByRole('option')).toHaveLength(7);
  });
});

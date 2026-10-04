import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it } from 'vitest';

import { CommandTrigger } from '@/components/command-trigger';
import messages from '@/messages/pt.json';

// O atalho visível entra no nome acessível (WCAG 2.5.3 Label in Name, MAI-661): o
// aria-label acompanha a plataforma junto com o <kbd>. Plataforma via navigator, como
// no shortcut-label.test.tsx.
function setPlatform(platform: string) {
  Object.defineProperty(window.navigator, 'platform', { value: platform, configurable: true });
}

afterEach(() => {
  Reflect.deleteProperty(window.navigator, 'platform');
});

function renderTrigger() {
  return render(
    <NextIntlClientProvider locale="pt" messages={messages}>
      <CommandTrigger />
    </NextIntlClientProvider>,
  );
}

describe('CommandTrigger', () => {
  it('no Mac, o nome acessível termina em ⌘K, igual ao <kbd>', () => {
    setPlatform('MacIntel');
    renderTrigger();

    const button = screen.getByRole('button', { name: `${messages.command.open} ⌘K` });
    expect(button).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K');
    expect(button.querySelector('kbd')).toHaveTextContent('⌘K');
  });

  it('no Windows, o nome acessível termina em Ctrl K, igual ao <kbd>', () => {
    setPlatform('Win32');
    renderTrigger();

    const button = screen.getByRole('button', { name: `${messages.command.open} Ctrl K` });
    expect(button).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K');
    expect(button.querySelector('kbd')).toHaveTextContent('Ctrl K');
  });
});

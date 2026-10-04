import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ShortcutLabel } from '@/components/shortcut-label';

// A plataforma vem do navigator: uma prop própria sombreia o getter do protótipo e
// sai no afterEach, sem vazar pros outros testes.
function setPlatform(platform: string) {
  Object.defineProperty(window.navigator, 'platform', { value: platform, configurable: true });
}

afterEach(() => {
  Reflect.deleteProperty(window.navigator, 'platform');
});

describe('ShortcutLabel', () => {
  it('mostra ⌘K no Mac', () => {
    setPlatform('MacIntel');
    render(<ShortcutLabel />);
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
  });

  it('mostra Ctrl K no Windows', () => {
    setPlatform('Win32');
    render(<ShortcutLabel />);
    expect(screen.getByText('Ctrl K').tagName).toBe('KBD');
  });
});

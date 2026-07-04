import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ORG_LOGOS } from '@/components/experience/org-logos';

// Contrato das logos: mono (currentColor), decorativa (aria-hidden) e escalável
// (viewBox). Itera o mapa — qualquer logo futura entra no contrato de graça.
describe('ORG_LOGOS', () => {
  it.each(Object.entries(ORG_LOGOS))(
    '%s renderiza svg mono, decorativo e escalável',
    (_org, Logo) => {
      const { container } = render(<Logo />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg).toHaveAttribute('fill', 'currentColor');
      expect(svg).toHaveAttribute('aria-hidden');
      expect(svg).toHaveAttribute('viewBox');
    },
  );
});

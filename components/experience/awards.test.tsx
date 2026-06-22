import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Awards, type AwardEntry } from '@/components/experience/awards';

const entries: AwardEntry[] = [
  {
    year: '2026',
    event: 'ActInSpace',
    result: '1º lugar, representando o Brasil na final na França.',
  },
  { year: '2025', event: 'AKCIT', result: '2º lugar, com projeto de IA generativa.' },
];

describe('Awards', () => {
  it('renderiza o ano em <time> com dateTime machine-readable', () => {
    render(<Awards entries={entries} />);
    const year = screen.getByText('2026');
    expect(year.tagName).toBe('TIME');
    expect(year).toHaveAttribute('datetime', '2026');
  });

  it('renderiza evento (heading) e resultado', () => {
    render(<Awards entries={entries} />);
    expect(screen.getByRole('heading', { name: 'ActInSpace' })).toBeInTheDocument();
    expect(
      screen.getByText('1º lugar, representando o Brasil na final na França.'),
    ).toBeInTheDocument();
  });

  it('separa os itens com DashedDivider (n - 1 separadores)', () => {
    render(<Awards entries={entries} />);
    expect(screen.getAllByRole('separator')).toHaveLength(entries.length - 1);
  });
});

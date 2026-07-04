import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FreedomAiLogo } from '@/components/experience/org-logos';
import { Timeline, type TimelineEntry } from '@/components/experience/timeline';

const entries: TimelineEntry[] = [
  {
    start: '2024-03',
    end: 'present',
    title: 'Engenheiro de IA',
    subtitle: 'Freedom.AI',
    description: 'Coloca LLM em produção.',
    tags: ['Next.js', 'Python'],
  },
  {
    start: '2022',
    end: '2024-02',
    title: 'Desenvolvedor',
    subtitle: 'Empresa X',
  },
];

describe('Timeline', () => {
  it('renderiza as datas em <time> com dateTime machine-readable', () => {
    render(<Timeline entries={entries} presentLabel="presente" />);

    const start = screen.getByText('2024-03');
    expect(start.tagName).toBe('TIME');
    expect(start).toHaveAttribute('datetime', '2024-03');

    const end = screen.getByText('2024-02');
    expect(end.tagName).toBe('TIME');
    expect(end).toHaveAttribute('datetime', '2024-02');
  });

  it("traduz o sentinela 'present' pro label, nunca renderiza a string crua", () => {
    render(<Timeline entries={entries} presentLabel="presente" />);
    expect(screen.getByText('presente')).toBeInTheDocument();
    expect(screen.queryByText('present')).toBeNull();
  });

  it('renderiza title, subtitle, description e stack (chips MonoTag)', () => {
    render(<Timeline entries={entries} presentLabel="presente" />);
    expect(screen.getByRole('heading', { name: 'Engenheiro de IA' })).toBeInTheDocument();
    expect(screen.getByText('Freedom.AI')).toBeInTheDocument();
    expect(screen.getByText('Coloca LLM em produção.')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('separa os itens com DashedDivider (n - 1 separadores)', () => {
    render(<Timeline entries={entries} presentLabel="presente" />);
    expect(screen.getAllByRole('separator')).toHaveLength(entries.length - 1);
  });

  it('item sem description/stack não quebra — serve educação (1 item, 0 separadores)', () => {
    render(
      <Timeline
        entries={[{ start: '2023', end: '2024', title: 'Residência em IA', subtitle: 'SENAI/SC' }]}
        presentLabel="presente"
      />,
    );
    expect(screen.getByRole('heading', { name: 'Residência em IA' })).toBeInTheDocument();
    expect(screen.getByText('SENAI/SC')).toBeInTheDocument();
    expect(screen.queryAllByRole('separator')).toHaveLength(0);
  });

  it('logo da organização é decorativa (aria-hidden) e o nome permanece texto visível', () => {
    const { container } = render(
      <Timeline
        entries={[
          {
            start: '2024',
            end: 'present',
            title: 'Engenheiro de IA',
            subtitle: 'Freedom.AI',
            logo: FreedomAiLogo,
          },
        ]}
        presentLabel="presente"
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden');
    expect(screen.getByText('Freedom.AI')).toBeInTheDocument();
  });

  it('renderiza a linha "projetos com" com label e nomes como texto', () => {
    render(
      <Timeline
        entries={[
          {
            start: '2025',
            end: 'present',
            title: 'Residência em IA',
            subtitle: 'SENAI/SC',
            projectsWith: ['Altona', 'Olsen'],
          },
        ]}
        presentLabel="presente"
        projectsWithLabel="projetos com"
      />,
    );
    expect(screen.getByText('projetos com')).toBeInTheDocument();
    expect(screen.getByText('Altona')).toBeInTheDocument();
    expect(screen.getByText('Olsen')).toBeInTheDocument();
  });

  it('não renderiza a linha de projetos sem projectsWithLabel', () => {
    render(
      <Timeline
        entries={[
          {
            start: '2025',
            end: '2026',
            title: 'Residência em IA',
            subtitle: 'SENAI/SC',
            projectsWith: ['Altona'],
          },
        ]}
        presentLabel="presente"
      />,
    );
    expect(screen.queryByText('Altona')).toBeNull();
  });

  it('stack vazia (tags: []) não renderiza lista vazia', () => {
    render(
      <Timeline
        entries={[
          {
            start: '2018',
            end: '2021',
            title: 'Analista Financeiro',
            subtitle: 'Softplan',
            tags: [],
          },
        ]}
        presentLabel="presente"
      />,
    );
    expect(screen.queryByRole('list')).toBeNull();
  });
});

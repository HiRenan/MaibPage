import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProjectCard, type ProjectCardLink } from '@/components/projects/project-card';

const links: ProjectCardLink[] = [
  { kind: 'repo', href: 'https://github.com/HiRenan/example', label: 'Code' },
  { kind: 'demo', href: 'https://example.com', label: 'Live' },
];

const baseProps = {
  name: 'IGNITE',
  year: '2026',
  role: 'Equipe (hackathon)',
  description: 'Imageria de satélite.',
  stack: ['React', 'Vite'],
  links,
  newTabLabel: 'abre em nova aba',
};

describe('ProjectCard', () => {
  it('renderiza o ano em <time> com dateTime machine-readable', () => {
    render(<ProjectCard {...baseProps} />);
    const year = screen.getByText('2026');
    expect(year.tagName).toBe('TIME');
    expect(year).toHaveAttribute('datetime', '2026');
  });

  it('renderiza name (heading), role e description', () => {
    render(<ProjectCard {...baseProps} />);
    expect(screen.getByRole('heading', { level: 2, name: 'IGNITE' })).toBeInTheDocument();
    expect(screen.getByText('Equipe (hackathon)')).toBeInTheDocument();
    expect(screen.getByText('Imageria de satélite.')).toBeInTheDocument();
  });

  it('renderiza cada item da stack como chip mono (MonoTag)', () => {
    render(<ProjectCard {...baseProps} />);
    expect(screen.getByText('React')).toHaveClass('font-mono');
    expect(screen.getByText('Vite')).toBeInTheDocument();
  });

  it('abre links externos em nova aba com rel seguro', () => {
    render(<ProjectCard {...baseProps} />);
    const repo = screen.getByRole('link', { name: /code/i });
    expect(repo).toHaveAttribute('href', 'https://github.com/HiRenan/example');
    expect(repo).toHaveAttribute('target', '_blank');
    expect(repo).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: /live/i })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('cada link externo anuncia a nova aba pro leitor de tela (sr-only)', () => {
    render(<ProjectCard {...baseProps} />);
    expect(screen.getAllByText('abre em nova aba')).toHaveLength(2);
  });

  it('não renderiza links quando a lista é vazia', () => {
    render(<ProjectCard {...baseProps} links={[]} />);
    expect(screen.queryByRole('link')).toBeNull();
  });
});

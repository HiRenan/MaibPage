import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SkillGroup } from '@/components/experience/skill-group';

describe('SkillGroup', () => {
  it('renderiza o label como heading (▸ é aria-hidden, fora do nome acessível)', () => {
    render(<SkillGroup label="Frameworks" skills={['Next.js', 'React']} />);
    expect(screen.getByRole('heading', { name: 'Frameworks' })).toBeInTheDocument();
  });

  it('renderiza cada skill como chip mono (MonoTag)', () => {
    render(<SkillGroup label="Languages" skills={['TypeScript', 'Python']} />);
    const ts = screen.getByText('TypeScript');
    expect(ts).toHaveClass('font-mono');
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('mantém a ordem das skills como recebida', () => {
    render(<SkillGroup label="Tools" skills={['Git', 'Docker', 'Figma']} />);
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items).toEqual(['Git', 'Docker', 'Figma']);
  });
});

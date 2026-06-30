import { describe, expect, it } from 'vitest';

import { sortProjects, type Project } from '@/data/projects';

// Fixture mínima — só os campos que a ordenação olha (featured) + name pra asserção.
function project(name: string, featured?: boolean): Project {
  return {
    name,
    year: '2025',
    role: { pt: '', en: '' },
    description: { pt: '', en: '' },
    stack: [],
    links: [],
    ...(featured ? { featured } : {}),
  };
}

describe('sortProjects', () => {
  it('põe os featured antes dos não-featured', () => {
    const input = [project('a'), project('b', true), project('c'), project('d', true)];
    expect(sortProjects(input).map((p) => p.name)).toEqual(['b', 'd', 'a', 'c']);
  });

  it('preserva a ordem de origem dentro de cada grupo (sort estável)', () => {
    const input = [project('x', true), project('y', true), project('z')];
    expect(sortProjects(input).map((p) => p.name)).toEqual(['x', 'y', 'z']);
  });

  it('trata featured ausente como false', () => {
    const input = [project('default'), project('featured', true)];
    expect(sortProjects(input).map((p) => p.name)).toEqual(['featured', 'default']);
  });

  it('não muta o array de entrada', () => {
    const input = [project('a'), project('b', true)];
    const before = input.map((p) => p.name);
    sortProjects(input);
    expect(input.map((p) => p.name)).toEqual(before);
  });
});

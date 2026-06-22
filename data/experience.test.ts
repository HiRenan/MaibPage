import { describe, expect, it } from 'vitest';

import { SKILL_CATEGORY_ORDER, sortSkillGroups, type SkillGroup } from '@/data/experience';

describe('sortSkillGroups', () => {
  it('ordena pela ordem canônica frameworks → languages → tools → ai-ml → infra', () => {
    const input: SkillGroup[] = [
      { category: 'infra', skills: ['Vercel'] },
      { category: 'ai-ml', skills: ['RAG'] },
      { category: 'frameworks', skills: ['Next.js'] },
      { category: 'tools', skills: ['Git'] },
      { category: 'languages', skills: ['TypeScript'] },
    ];
    expect(sortSkillGroups(input).map((group) => group.category)).toEqual([
      'frameworks',
      'languages',
      'tools',
      'ai-ml',
      'infra',
    ]);
  });

  it('descarta categorias sem skills', () => {
    const input: SkillGroup[] = [
      { category: 'frameworks', skills: ['Next.js'] },
      { category: 'languages', skills: [] },
    ];
    expect(sortSkillGroups(input).map((group) => group.category)).toEqual(['frameworks']);
  });

  it('inclui só as categorias presentes (subconjunto), na ordem certa', () => {
    const input: SkillGroup[] = [
      { category: 'infra', skills: ['Docker'] },
      { category: 'frameworks', skills: ['React'] },
    ];
    expect(sortSkillGroups(input).map((group) => group.category)).toEqual(['frameworks', 'infra']);
  });

  it('não muta o array de entrada', () => {
    const input: SkillGroup[] = [
      { category: 'infra', skills: ['Docker'] },
      { category: 'frameworks', skills: ['React'] },
    ];
    const before = input.map((group) => group.category);
    sortSkillGroups(input);
    expect(input.map((group) => group.category)).toEqual(before);
  });

  it('SKILL_CATEGORY_ORDER é a fonte da ordem (5 categorias canônicas)', () => {
    expect(SKILL_CATEGORY_ORDER).toEqual(['frameworks', 'languages', 'tools', 'ai-ml', 'infra']);
  });
});

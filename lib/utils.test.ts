import { describe, expect, it } from 'vitest';

import { cssTimeToMs } from '@/lib/utils';

describe('cssTimeToMs', () => {
  it('lê ms como está', () => {
    expect(cssTimeToMs('40ms')).toBe(40);
  });

  it('converte s em ms, inclusive a forma minificada sem zero', () => {
    expect(cssTimeToMs('.48s')).toBe(480);
    expect(cssTimeToMs('0.9s')).toBe(900);
  });

  it('ignora o espaço que getPropertyValue pode devolver', () => {
    expect(cssTimeToMs(' 480ms')).toBe(480);
  });
});

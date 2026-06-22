import { readFileSync } from 'node:fs';
import path from 'node:path';

import { compile } from '@mdx-js/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { describe, expect, it } from 'vitest';

// Prova, sem rota, que o pipeline destaca código: compila o hello-world real pela
// MESMA cadeia (remark-gfm + rehype-pretty-code) e confere a marcação do shiki.
describe('pipeline MDX', () => {
  it('destaca os blocos de código do hello-world (tema dark via rehype-pretty-code)', async () => {
    const source = readFileSync(
      path.join(process.cwd(), 'content', 'posts', 'hello-world.pt.mdx'),
      'utf8',
    );

    const compiled = String(
      await compile(source, {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, { theme: 'vitesse-dark', keepBackground: false }]],
      }),
    );

    // Marcadores do rehype-pretty-code + uma cor de token do shiki = destaque aplicado.
    expect(compiled).toContain('data-rehype-pretty-code-figure');
    expect(compiled).toContain('data-language');
    expect(compiled).toMatch(/#[0-9a-fA-F]{6}/);
  });
});

import { describe, expect, it } from 'vitest';

import {
  buildPostIndex,
  frontmatterSchema,
  getAllPosts,
  getPostCommandItems,
  parsePostFilename,
} from '@/lib/posts';

// Monta um .mdx cru a partir de partes — `extra` injeta linhas no frontmatter.
function rawPost(slug: string, lang: string, date: string, extra = '') {
  return {
    filename: `${slug}.${lang}.mdx`,
    content: `---\ntitle: '${slug} ${lang}'\ndescription: 'desc'\ndate: '${date}'\n${extra}---\ncorpo`,
  };
}

describe('frontmatterSchema', () => {
  it('aceita frontmatter válido e aplica defaults (tags [], fallback false)', () => {
    const parsed = frontmatterSchema.parse({ title: 't', description: 'd', date: '2026-06-21' });
    expect(parsed.tags).toEqual([]);
    expect(parsed.fallback).toBe(false);
  });

  it('FALHA sem title — prova o invariante "build quebra se inválido"', () => {
    expect(frontmatterSchema.safeParse({ description: 'd', date: '2026-06-21' }).success).toBe(
      false,
    );
  });

  it('FALHA com date inválida', () => {
    expect(
      frontmatterSchema.safeParse({ title: 't', description: 'd', date: 'não-é-data' }).success,
    ).toBe(false);
  });
});

describe('parsePostFilename', () => {
  it('deriva {slug, lang} de <slug>.<lang>.mdx', () => {
    expect(parsePostFilename('hello-world.pt.mdx')).toEqual({ slug: 'hello-world', lang: 'pt' });
  });

  it('rejeita nomes malformados', () => {
    expect(() => parsePostFilename('hello-world.mdx')).toThrow();
    expect(() => parsePostFilename('hello world.pt.mdx')).toThrow();
  });

  it('rejeita lang fora do conjunto de locales', () => {
    expect(() => parsePostFilename('hello.fr.mdx')).toThrow();
  });
});

describe('buildPostIndex', () => {
  it('ordena o índice completo por data desc', () => {
    const index = buildPostIndex([
      rawPost('older', 'pt', '2025-01-01'),
      rawPost('older', 'en', '2025-01-01'),
      rawPost('newer', 'pt', '2026-06-01'),
      rawPost('newer', 'en', '2026-06-01'),
    ]);
    expect(index.map((post) => post.slug)).toEqual(['newer', 'newer', 'older', 'older']);
  });

  it('quebra quando um slug falta num locale sem fallback (assimetria i18n)', () => {
    expect(() => buildPostIndex([rawPost('solo', 'pt', '2026-06-01')])).toThrow(/simetria/i);
  });

  it('aceita a assimetria quando o post declara fallback: true', () => {
    const index = buildPostIndex([rawPost('solo', 'pt', '2026-06-01', 'fallback: true\n')]);
    expect(index).toHaveLength(1);
    expect(index[0]?.fallback).toBe(true);
  });
});

describe('getAllPosts / getPostCommandItems (conteúdo real)', () => {
  it('retorna só o locale pedido, com hello-world presente', () => {
    const pt = getAllPosts('pt');
    expect(pt.length).toBeGreaterThan(0);
    expect(pt.every((post) => post.lang === 'pt')).toBe(true);
    expect(pt.some((post) => post.slug === 'hello-world')).toBe(true);
  });

  it('expõe itens da paleta ⌘K com href /blog/<slug>', () => {
    const hello = getPostCommandItems('en').find((item) => item.slug === 'hello-world');
    expect(hello?.href).toBe('/blog/hello-world');
    expect(hello?.title).toBeTruthy();
    expect(hello?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

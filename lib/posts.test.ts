import { describe, expect, it } from 'vitest';

import {
  adjacentInIndex,
  buildPostIndex,
  frontmatterSchema,
  getAllPosts,
  getAllTags,
  getPostBySlug,
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

  it('expõe itens da paleta ⌘K com href /blog/<slug> + tags pro filtro', () => {
    const hello = getPostCommandItems('en').find((item) => item.slug === 'hello-world');
    expect(hello?.href).toBe('/blog/hello-world');
    expect(hello?.title).toBeTruthy();
    expect(hello?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(hello?.tags).toContain('meta');
  });
});

describe('getAllTags (conteúdo real)', () => {
  it('retorna as tags do locale únicas e ordenadas asc', () => {
    const tags = getAllTags('pt');
    expect(tags).toContain('meta');
    expect(tags).toContain('build-in-public');
    expect(tags).toEqual([...tags].sort((a, b) => a.localeCompare(b))); // ordenado asc
    expect(new Set(tags).size).toBe(tags.length); // sem duplicatas
  });

  it('ordena de fato (build-in-public antes de meta)', () => {
    const tags = getAllTags('en');
    expect(tags.indexOf('build-in-public')).toBeLessThan(tags.indexOf('meta'));
  });
});

describe('getPostBySlug', () => {
  it('acha o post no locale pedido', () => {
    const post = getPostBySlug('hello-world', 'pt');
    expect(post?.slug).toBe('hello-world');
    expect(post?.lang).toBe('pt');
  });

  it('retorna null pra slug inexistente (a rota cai em notFound)', () => {
    expect(getPostBySlug('nao-existe', 'pt')).toBeNull();
  });
});

describe('readingTime', () => {
  it('computa minutos pelo corpo (~200 palavras/min), ignorando o frontmatter', () => {
    const body = Array.from({ length: 400 }, () => 'palavra').join(' ');
    const [post] = buildPostIndex([
      {
        filename: 'longo.pt.mdx',
        content: `---\ntitle: 't'\ndescription: 'd'\ndate: '2026-01-01'\nfallback: true\n---\n${body}`,
      },
    ]);
    expect(post?.readingTime).toBe(2); // 400 / 200
  });

  it('arredonda pra no mínimo 1 min em corpo curto (hello-world real)', () => {
    expect(getPostBySlug('hello-world', 'pt')?.readingTime).toBeGreaterThanOrEqual(1);
  });
});

describe('adjacentInIndex', () => {
  // Índice pt de dois posts, já ordenado por data desc: [newer, older].
  const index = buildPostIndex([
    rawPost('newer', 'pt', '2026-06-01'),
    rawPost('newer', 'en', '2026-06-01'),
    rawPost('older', 'pt', '2025-01-01'),
    rawPost('older', 'en', '2025-01-01'),
  ]).filter((post) => post.lang === 'pt');

  it('no post mais novo: previous = o mais antigo, next = null', () => {
    const { previous, next } = adjacentInIndex(index, 'newer');
    expect(previous?.slug).toBe('older');
    expect(next).toBeNull();
  });

  it('no post mais antigo: previous = null, next = o mais novo', () => {
    const { previous, next } = adjacentInIndex(index, 'older');
    expect(previous).toBeNull();
    expect(next?.slug).toBe('newer');
  });

  it('post único: ambos os lados somem (null)', () => {
    const solo = buildPostIndex([rawPost('solo', 'pt', '2026-01-01', 'fallback: true\n')]);
    expect(adjacentInIndex(solo, 'solo')).toEqual({ previous: null, next: null });
  });
});

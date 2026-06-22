import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { z } from 'zod';

import { routing } from '@/i18n/routing';

export type Locale = (typeof routing.locales)[number];

const LOCALES = routing.locales;
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

// Convenção: content/posts/<slug>.<lang>.mdx — o lang vem do nome (fonte da verdade).
const POST_FILENAME = /^(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)\.(?<lang>[a-z]{2})\.mdx$/;

// Frontmatter de todo post. Inválido = erro que quebra o build (invariante).
// `date` aceita string ISO ou Date (YAML desserializa data sem aspas como Date).
// `fallback: true` documenta, explicitamente, uma assimetria pt/en intencional.
export const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  fallback: z.boolean().default(false),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type Post = {
  slug: string;
  lang: Locale;
  title: string;
  description: string;
  date: string; // 'YYYY-MM-DD'
  tags: string[];
  fallback: boolean;
  readingTime: number; // minutos, ~200 palavras/min, mínimo 1
};

// Item consumível pela paleta ⌘K (MAI-483) e pelo índice do blog (fase seguinte).
export type PostCommandItem = {
  slug: string;
  title: string;
  href: string; // '/blog/<slug>'
  date: string;
  tags: string[]; // alimenta o fuzzy match da paleta (título + tags)
};

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Deriva {slug, lang} do nome do arquivo. Rejeita qualquer coisa fora de
// '<slug>.<lang>.mdx' com lang dentro do conjunto de locales.
export function parsePostFilename(filename: string): { slug: string; lang: Locale } {
  const match = POST_FILENAME.exec(filename);
  const slug = match?.groups?.slug;
  const lang = match?.groups?.lang;
  if (!slug || !lang || !isLocale(lang)) {
    throw new Error(`Nome de arquivo inválido: "${filename}" (esperado <slug>.<lang>.mdx)`);
  }
  return { slug, lang };
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Tempo de leitura inline (sem dep): ~200 palavras/min sobre o corpo, mínimo 1 min.
const WORDS_PER_MINUTE = 200;

function computeReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

type RawPost = { filename: string; content: string };

// Núcleo puro e testável: valida frontmatter, deriva slug/lang, garante simetria
// i18n e ordena por data desc. Lança em qualquer violação (invariante de build).
export function buildPostIndex(files: RawPost[]): Post[] {
  const posts = files.map(({ filename, content }) => {
    const { slug, lang } = parsePostFilename(filename);
    const file = matter(content);
    const parsed = frontmatterSchema.safeParse(file.data);
    if (!parsed.success) {
      throw new Error(`Frontmatter inválido em "${filename}": ${parsed.error.message}`);
    }
    const { title, description, date, tags, fallback } = parsed.data;
    return {
      slug,
      lang,
      title,
      description,
      date: toIsoDate(date),
      tags,
      fallback,
      readingTime: computeReadingTime(file.content),
    } satisfies Post;
  });

  assertLocaleSymmetry(posts);

  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// Invariante: cada slug existe em todos os locales OU declara `fallback: true`.
// Surfaceia a assimetria em vez de engoli-la — assimetria silenciosa quebra o build.
function assertLocaleSymmetry(posts: Post[]): void {
  const bySlug = new Map<string, Post[]>();
  for (const post of posts) {
    const group = bySlug.get(post.slug) ?? [];
    group.push(post);
    bySlug.set(post.slug, group);
  }

  for (const [slug, group] of bySlug) {
    if (group.some((post) => post.fallback)) continue;
    const present = new Set(group.map((post) => post.lang));
    const missing = LOCALES.filter((locale) => !present.has(locale));
    if (missing.length > 0) {
      throw new Error(
        `Post "${slug}" sem simetria i18n: falta [${missing.join(', ')}]. ` +
          `Traduza, ou declare "fallback: true" no frontmatter pra documentar a lacuna.`,
      );
    }
  }
}

// --- Camada de IO (servidor): lê content/posts e monta o índice. ---

function readRawPosts(dir: string): RawPost[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => ({
      filename,
      content: fs.readFileSync(path.join(dir, filename), 'utf8'),
    }));
}

// Índice completo (todos os locales), validado e ordenado. SSOT do conteúdo.
export function getPostIndex(dir: string = POSTS_DIR): Post[] {
  return buildPostIndex(readRawPosts(dir));
}

// Posts de um locale, por data desc. Consumido pelo índice do blog (fase seguinte).
export function getAllPosts(locale: Locale, dir: string = POSTS_DIR): Post[] {
  return getPostIndex(dir).filter((post) => post.lang === locale);
}

// Tags únicas de um locale, ordenadas asc. Alimenta o filtro do índice (MAI-510)
// e, depois, as páginas por tag (MAI-560). Derivado do índice já validado.
export function getAllTags(locale: Locale, dir: string = POSTS_DIR): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts(locale, dir)) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

// Post de um slug+locale, ou null se o arquivo daquele locale não existe.
// A rota usa o null pra cair em notFound() — nunca renderiza o outro idioma no lugar.
export function getPostBySlug(slug: string, locale: Locale, dir: string = POSTS_DIR): Post | null {
  return getAllPosts(locale, dir).find((post) => post.slug === slug) ?? null;
}

// Puro e testável: vizinhos num índice já ordenado (date desc). `previous` é o post
// mais antigo (←), `next` o mais recente (→); bordas viram null (1 post = ambos null).
export function adjacentInIndex(
  posts: Post[],
  slug: string,
): { previous: Post | null; next: Post | null } {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

// Vizinhança cronológica de um post no índice do seu locale.
export function getAdjacentPosts(
  slug: string,
  locale: Locale,
  dir: string = POSTS_DIR,
): { previous: Post | null; next: Post | null } {
  return adjacentInIndex(getAllPosts(locale, dir), slug);
}

// Itens de comando da paleta ⌘K (MAI-483): { slug, title, href, date }.
export function getPostCommandItems(locale: Locale, dir: string = POSTS_DIR): PostCommandItem[] {
  return getAllPosts(locale, dir).map((post) => ({
    slug: post.slug,
    title: post.title,
    href: `/blog/${post.slug}`,
    date: post.date,
    tags: post.tags,
  }));
}

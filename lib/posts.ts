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
};

// Item consumível pela paleta ⌘K (MAI-483) e pelo índice do blog (fase seguinte).
export type PostCommandItem = {
  slug: string;
  title: string;
  href: string; // '/blog/<slug>'
  date: string;
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

type RawPost = { filename: string; content: string };

// Núcleo puro e testável: valida frontmatter, deriva slug/lang, garante simetria
// i18n e ordena por data desc. Lança em qualquer violação (invariante de build).
export function buildPostIndex(files: RawPost[]): Post[] {
  const posts = files.map(({ filename, content }) => {
    const { slug, lang } = parsePostFilename(filename);
    const parsed = frontmatterSchema.safeParse(matter(content).data);
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

// Itens de comando da paleta ⌘K (MAI-483): { slug, title, href, date }.
export function getPostCommandItems(locale: Locale, dir: string = POSTS_DIR): PostCommandItem[] {
  return getAllPosts(locale, dir).map((post) => ({
    slug: post.slug,
    title: post.title,
    href: `/blog/${post.slug}`,
    date: post.date,
  }));
}

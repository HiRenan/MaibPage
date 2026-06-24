import fs from 'node:fs';
import path from 'node:path';

import GithubSlugger from 'github-slugger';
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

// Heading do corpo de um post (h2/h3), pro Table of Contents (MAI-515).
// `id` bate com o id que o rehype-slug injeta no HTML (mesma lib: github-slugger).
export type Heading = { depth: 2 | 3; text: string; id: string };

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

// Normaliza o texto inline de um heading pro mesmo texto puro que o rehype-slug
// enxerga no HAST renderizado (via hast-util-to-string): sem **, *, `, e
// [txt](url) → txt. Imagens somem (alt não entra no to-string).
//
// Limitação conhecida: ênfase com `_` (`_foo_`) NÃO é normalizada e diverge do
// rehype-slug — ele parseia `_foo_` pra <em>foo</em> e gera id `foo`, enquanto
// aqui o `_` sobrevive e vira id `_foo_` (a âncora desse heading quebraria). É
// aceito: `_` em heading é raro, a convenção da casa é `*` (essa sim é tratada);
// um regex pra regra de underscore-intraword do CommonMark arriscaria quebrar
// `snake_case` em heading, que hoje casa nos dois lados. Revisitar se surgir.
function normalizeHeadingText(raw: string): string {
  return raw
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // imagens ![alt](url) → ''
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links [txt](url) → txt
    .replace(/`+/g, '') // inline code → tira as crases
    .replace(/\*/g, '') // strong/em asterisco → tira os *
    .replace(/\s+/g, ' ')
    .trim();
}

// Puro e testável: varre o markdown raw e captura só ATX h2/h3 (## e ###), na
// ordem do documento. Pula blocos de código cercados (``` e ~~~). O `id` sai de
// uma única instância GithubSlugger por chamada — replica o reset-por-documento
// do rehype-slug, incluindo o dedup (`setup`, `setup-1`).
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split('\n')) {
    // Alterna o estado de code fence (``` ou ~~~, até 3 espaços de indentação).
    if (/^ {0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // `#{2,3}` + espaço obrigatório descarta `# `(h1) e `#### `(h4+) por
    // backtracking; o `\s*#*\s*$` final come hashes de fechamento opcionais.
    const match = /^ {0,3}(?<hashes>#{2,3})\s+(?<text>.+?)\s*#*\s*$/.exec(line);
    const hashes = match?.groups?.hashes;
    const rawText = match?.groups?.text;
    if (!hashes || !rawText) continue;

    const text = normalizeHeadingText(rawText);
    if (!text) continue;
    headings.push({ depth: hashes.length as 2 | 3, text, id: slugger.slug(text) });
  }

  return headings;
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

// Os N posts mais recentes de um locale, pra vitrine da home (MAI-496). Thin sobre
// getAllPosts (já date desc); default 3. Com menos posts que o limite, devolve o que há.
export function getFeaturedPosts(locale: Locale, limit = 3, dir: string = POSTS_DIR): Post[] {
  return getAllPosts(locale, dir).slice(0, limit);
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

// IO (servidor): lê content/posts/<slug>.<locale>.mdx e extrai os headings h2/h3
// do corpo, pro ToC da página de post. Arquivo ausente → [] (a rota já garante a
// existência via getPostBySlug antes de renderizar).
export function getPostHeadings(slug: string, locale: Locale, dir: string = POSTS_DIR): Heading[] {
  const filepath = path.join(dir, `${slug}.${locale}.mdx`);
  if (!fs.existsSync(filepath)) return [];
  return extractHeadings(matter(fs.readFileSync(filepath, 'utf8')).content);
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

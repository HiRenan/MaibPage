'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Fragment, useState, type ReactNode } from 'react';

import { PostCard } from '@/components/blog/post-card';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { cn } from '@/lib/utils';

export type BlogListPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // 'YYYY-MM-DD'
  tags: string[];
  readingTime: number;
};

type BlogListProps = {
  posts: BlogListPost[];
  tags: string[];
};

// A única ilha client da página: segura a tag selecionada, filtra, agrupa por ano
// desc e renderiza os PostCards. A page é RSC; só este pedaço precisa de estado.
// Datas formatadas via useFormatter (provider já no layout), em UTC pra não deslocar.
export function BlogList({ posts, tags }: BlogListProps) {
  const t = useTranslations('blog');
  const tPost = useTranslations('post');
  const format = useFormatter();
  const [selected, setSelected] = useState<string | null>(null);

  // Single-select derivado de getAllTags -> toda chip pertence a >=1 post, então o
  // resultado nunca é vazio (sem estado "sem resultados" a construir).
  const visible = selected ? posts.filter((post) => post.tags.includes(selected)) : posts;
  const groups = groupByYear(visible);

  return (
    <div>
      <div role="group" aria-label={t('filterLabel')} className="flex flex-wrap items-center gap-2">
        <TagChip active={selected === null} onClick={() => setSelected(null)}>
          {t('allTag')}
        </TagChip>
        {tags.map((tag) => (
          <TagChip
            key={tag}
            active={selected === tag}
            onClick={() => setSelected((current) => (current === tag ? null : tag))}
          >
            {tag}
          </TagChip>
        ))}
        {selected !== null && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-muted-foreground hover:text-primary ml-1 font-mono text-xs underline-offset-4 transition-colors hover:underline"
          >
            {t('clearFilter')}
          </button>
        )}
      </div>

      <div className="mt-10">
        {groups.map(({ year, posts: yearPosts }, index) => (
          <Fragment key={year}>
            {index > 0 && <DashedDivider />}
            <section aria-labelledby={`blog-year-${year}`}>
              <h2
                id={`blog-year-${year}`}
                className="text-muted-foreground font-mono text-xs font-medium tracking-[0.14em]"
              >
                <span aria-hidden>▸ </span>
                {year}
              </h2>
              <ul className="mt-4">
                {yearPosts.map((post) => (
                  <li key={post.slug}>
                    <PostCard
                      slug={post.slug}
                      title={post.title}
                      description={post.description}
                      dateTime={post.date}
                      dateLabel={format.dateTime(new Date(post.date), {
                        day: 'numeric',
                        month: 'long',
                        timeZone: 'UTC', // data nua YYYY-MM-DD; UTC evita deslocar -1 dia.
                      })}
                      readingTimeLabel={tPost('readingTime', { minutes: post.readingTime })}
                      tags={post.tags}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

// Chip de filtro: botão (interativo, ao contrário do MonoTag display). Ativo =
// ember, espelhando o data-[selected] do ⌘K (bg-primary/10 + border/text primary).
// aria-pressed + peso reforçam o estado além da cor (daltônico-safe).
function TagChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 items-center rounded-sm border px-3 font-mono text-sm leading-none transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-foreground/30 hover:bg-accent hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

// posts já chegam ordenados por data desc (getAllPosts) -> dentro do ano seguem
// desc; aqui só agrupamos e ordenamos os anos desc.
function groupByYear(posts: BlogListPost[]): { year: string; posts: BlogListPost[] }[] {
  const byYear = new Map<string, BlogListPost[]>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const list = byYear.get(year) ?? [];
    list.push(post);
    byYear.set(year, list);
  }
  return [...byYear.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}

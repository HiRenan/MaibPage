import { getFormatter, getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import type { Post } from '@/lib/posts';

// Vitrine de posts da home (MAI-496): data mono à esquerda, título à direita. De
// propósito mais enxuta que o PostCard do /blog (sem descrição, tags ou reading time)
// — aqui é teaser, não índice. Server: datas via getFormatter em UTC (a data nua
// 'YYYY-MM-DD' não desloca -1 dia). O Link inteiro é o alvo focável de cada item.
export async function FeaturedPosts({ posts }: { posts: Post[] }) {
  const t = await getTranslations('home.featured');
  const format = await getFormatter();

  return (
    <section aria-labelledby="home-featured" className="flex flex-col gap-6">
      <h2
        id="home-featured"
        className="text-muted-foreground font-mono text-sm font-medium tracking-[0.12em]"
      >
        <span aria-hidden>▸ </span>
        {t('heading')}
      </h2>

      <ul className="flex flex-col">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group hover:bg-accent focus-visible:bg-accent -mx-4 flex flex-col gap-1 rounded-sm px-4 py-3 transition-colors sm:flex-row sm:items-baseline sm:gap-5"
            >
              <time
                dateTime={post.date}
                className="text-muted-foreground shrink-0 font-mono text-sm tabular-nums"
              >
                {format.dateTime(new Date(post.date), {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
              <span className="text-foreground group-hover:text-primary text-lg tracking-tight text-pretty transition-colors">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/blog"
        className="text-muted-foreground hover:text-primary self-start font-mono text-sm underline-offset-4 transition-colors hover:underline"
      >
        {t('viewAll')}
        <span aria-hidden> →</span>
      </Link>
    </section>
  );
}

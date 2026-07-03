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
              className="group hover:bg-accent focus-visible:bg-accent duration-base ease-out-expo -mx-4 flex flex-col gap-1 rounded-sm px-4 py-3 transition-colors sm:flex-row sm:items-baseline sm:gap-5"
            >
              <time
                dateTime={post.date}
                className="text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground duration-base ease-out-expo shrink-0 font-mono text-sm tabular-nums transition-colors"
              >
                {format.dateTime(new Date(post.date), {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
              <span className="text-foreground group-hover:text-primary group-focus-visible:text-primary duration-base ease-out-expo text-lg tracking-tight text-pretty transition-colors">
                {post.title}
                <span
                  aria-hidden
                  className="text-muted-foreground/60 group-hover:text-primary group-focus-visible:text-primary duration-base ease-out-expo ml-2 inline-block font-mono text-sm transition group-hover:translate-x-1 group-focus-visible:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/blog"
        className="group text-muted-foreground hover:text-primary focus-visible:text-primary duration-base ease-out-expo self-start font-mono text-sm underline-offset-4 transition-colors hover:underline"
      >
        {t('viewAll')}{' '}
        <span
          aria-hidden
          className="duration-base ease-out-expo inline-block transition group-hover:translate-x-1 group-focus-visible:translate-x-1"
        >
          →
        </span>
      </Link>
    </section>
  );
}

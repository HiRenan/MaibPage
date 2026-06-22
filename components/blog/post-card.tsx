import { MonoTag } from '@/components/ui/mono-tag';
import { Link } from '@/i18n/navigation';

export type PostCardProps = {
  slug: string;
  title: string;
  description: string;
  dateTime: string; // ISO 'YYYY-MM-DD' pro atributo <time> (machine-readable)
  dateLabel: string; // data formatada pra leitura (dia + mês; o ano vive no grupo)
  readingTimeLabel: string;
  tags: string[];
};

// Apresentacional (MAI-509): o Link embrulha o card inteiro -> um único alvo
// focável. Plano em repouso; no hover/foco pinta um painel quente (luz, não glow,
// via --accent) e acende o título em ember. Tags = display-only (span), nunca
// links aninhados (= <a> dentro de <a>, HTML inválido + a11y ruim); o mecanismo
// de filtro é a linha do topo.
export function PostCard({
  slug,
  title,
  description,
  dateTime,
  dateLabel,
  readingTimeLabel,
  tags,
}: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group hover:bg-accent focus-visible:bg-accent -mx-4 block rounded-sm px-4 py-5 transition-colors"
    >
      <h3 className="text-foreground group-hover:text-primary text-xl font-medium tracking-tight text-pretty transition-colors">
        {title}
      </h3>

      <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-2 font-mono text-sm">
        <time dateTime={dateTime}>{dateLabel}</time>
        <span aria-hidden>·</span>
        <span>{readingTimeLabel}</span>
      </div>

      <p className="text-muted-foreground mt-3 text-pretty">{description}</p>

      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <MonoTag size="sm">{tag}</MonoTag>
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}

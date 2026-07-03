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
      className="group hover:bg-accent focus-visible:bg-accent duration-base ease-out-expo -mx-4 block rounded-sm px-4 py-5 transition-colors"
    >
      <h3 className="text-foreground group-hover:text-primary group-focus-visible:text-primary duration-base ease-out-expo text-xl font-medium tracking-tight text-pretty transition-colors">
        {title}
        {/* Indicador visível em repouso (affordance de link sem hover — crítica P2);
            no hover desliza e acende junto do título. Decorativo: aria-hidden. */}
        <span
          aria-hidden
          className="text-muted-foreground/60 group-hover:text-primary group-focus-visible:text-primary duration-base ease-out-expo ml-2 inline-block font-mono transition group-hover:translate-x-1 group-focus-visible:translate-x-1"
        >
          →
        </span>
      </h3>

      <div className="text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground duration-base ease-out-expo mt-2 flex flex-wrap items-center gap-x-2 font-mono text-sm transition-colors">
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

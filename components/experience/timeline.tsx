import { Fragment } from 'react';

import { DashedDivider } from '@/components/ui/dashed-divider';
import { MonoTag } from '@/components/ui/mono-tag';
import { PRESENT } from '@/data/experience';

export type TimelineEntry = {
  start: string;
  end: string; // data ('YYYY'|'YYYY-MM') OU o sentinela PRESENT -> vira presentLabel
  title: string;
  subtitle: string;
  description?: string;
  tags?: string[];
};

type TimelineProps = {
  entries: TimelineEntry[];
  presentLabel: string;
};

// Timeline genérica — serve experiência E educação. Datas em mono na coluna fixa à
// esquerda, conteúdo à direita; no mobile empilha (datas acima). DashedDivider entre
// itens. Apresentacional/server: a página resolve idioma e label antes de passar.
export function Timeline({ entries, presentLabel }: TimelineProps) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => (
        <Fragment key={`${entry.start}-${entry.subtitle}`}>
          {index > 0 && <DashedDivider className="my-0" />}
          <div className="grid grid-cols-1 gap-2 py-6 first:pt-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
            <DateRange start={entry.start} end={entry.end} presentLabel={presentLabel} />
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-foreground font-medium text-pretty">{entry.title}</h3>
                <p className="text-muted-foreground text-sm">{entry.subtitle}</p>
              </div>
              {entry.description && (
                <p className="text-muted-foreground text-pretty">{entry.description}</p>
              )}
              {entry.tags && entry.tags.length > 0 && (
                <ul className="mt-1 flex flex-wrap items-center gap-2">
                  {entry.tags.map((tag) => (
                    <li key={tag}>
                      <MonoTag size="sm">{tag}</MonoTag>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

// Range mono. start sempre <time>; end vira presentLabel (sentinela) ou <time>. No
// mobile fica inline com uma seta; no desktop empilha (seta escondida). Seta é
// decorativa (aria-hidden) — o leitor de tela ouve "início fim".
function DateRange({
  start,
  end,
  presentLabel,
}: {
  start: string;
  end: string;
  presentLabel: string;
}) {
  const ongoing = end === PRESENT;

  return (
    <p className="text-muted-foreground flex flex-row flex-wrap items-baseline gap-x-1.5 font-mono text-sm sm:flex-col sm:gap-y-0.5">
      <time dateTime={start}>{start}</time>
      <span aria-hidden className="text-border sm:hidden">
        →
      </span>
      {ongoing ? (
        <span className="text-foreground/70">{presentLabel}</span>
      ) : (
        <time dateTime={end}>{end}</time>
      )}
    </p>
  );
}

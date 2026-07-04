import { Fragment, type ComponentProps, type ComponentType } from 'react';

import { DashedDivider } from '@/components/ui/dashed-divider';
import { MonoTag } from '@/components/ui/mono-tag';
import { PRESENT } from '@/data/experience';

type OrgLogo = ComponentType<ComponentProps<'svg'>>;

export type TimelineEntry = {
  start: string;
  end: string; // data ('YYYY'|'YYYY-MM') OU o sentinela PRESENT -> vira presentLabel
  title: string;
  subtitle: string;
  logo?: OrgLogo; // marca mono da organização (decorativa; o subtitle segue como texto)
  description?: string;
  tags?: string[];
  // Projetos feitos via a organização (não vínculo) — linha "projetos com". Nomes em
  // texto, sem logo (subordinados; o sinal é o nome).
  projectsWith?: string[];
};

type TimelineProps = {
  entries: TimelineEntry[];
  presentLabel: string;
  // Label da linha "projetos com" (i18n resolvido na page). Sem ela, a linha não rende.
  projectsWithLabel?: string;
};

// Timeline genérica — serve experiência E educação. Datas em mono na coluna fixa à
// esquerda, conteúdo à direita; no mobile empilha (datas acima). DashedDivider entre
// itens. Apresentacional/server: a página resolve idioma, label e logo antes de passar.
// Logos: mono em muted no repouso, acendem pra foreground no hover da entry (group) —
// resposta tonal, sem entrada (Regra da Entrada Única).
export function Timeline({ entries, presentLabel, projectsWithLabel }: TimelineProps) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => {
        const Logo = entry.logo;
        return (
          <Fragment key={`${entry.start}-${entry.subtitle}`}>
            {index > 0 && <DashedDivider className="my-0" />}
            <div className="group grid grid-cols-1 gap-2 py-6 first:pt-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
              <DateRange start={entry.start} end={entry.end} presentLabel={presentLabel} />
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-foreground font-medium text-pretty">{entry.title}</h3>
                  <p className="text-muted-foreground flex items-center gap-2 text-sm">
                    {Logo && (
                      <Logo className="duration-base ease-out-expo group-hover:text-foreground h-4 w-auto shrink-0 transition-colors" />
                    )}
                    <span>{entry.subtitle}</span>
                  </p>
                </div>
                {entry.description && (
                  <p className="text-muted-foreground text-pretty">{entry.description}</p>
                )}
                {projectsWithLabel && entry.projectsWith && entry.projectsWith.length > 0 && (
                  <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="font-mono text-xs tracking-[0.08em]">{projectsWithLabel}</span>
                    {entry.projectsWith.map((name, i) => (
                      <Fragment key={name}>
                        {i > 0 && <span aria-hidden>·</span>}
                        <span>{name}</span>
                      </Fragment>
                    ))}
                  </p>
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
        );
      })}
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

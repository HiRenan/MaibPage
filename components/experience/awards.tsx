import { Fragment } from 'react';

import { DashedDivider } from '@/components/ui/dashed-divider';

export type AwardEntry = {
  year: string;
  event: string;
  result: string; // já resolvido pro locale pela página
};

type AwardsProps = {
  entries: AwardEntry[];
};

// Prêmios: ano em mono na coluna fixa à esquerda (alinha com as datas da Timeline),
// evento + resultado à direita. Ponto no tempo, não range — sem DateRange. DashedDivider
// entre itens. Apresentacional/server: a página resolve o idioma do `result` antes de passar.
export function Awards({ entries }: AwardsProps) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => (
        <Fragment key={`${entry.year}-${entry.event}`}>
          {index > 0 && <DashedDivider className="my-0" />}
          <div className="grid grid-cols-1 gap-2 py-6 first:pt-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
            <p className="text-muted-foreground font-mono text-sm">
              <time dateTime={entry.year}>{entry.year}</time>
            </p>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-foreground font-medium text-pretty">{entry.event}</h3>
              <p className="text-muted-foreground text-pretty">{entry.result}</p>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

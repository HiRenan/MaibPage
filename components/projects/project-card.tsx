import { MonoTag } from '@/components/ui/mono-tag';
import { cn } from '@/lib/utils';

export type ProjectCardLink = {
  kind: 'repo' | 'demo';
  href: string;
  label: string; // resolvido pelo locale na página (messages.projects.links[kind])
};

export type ProjectCardProps = {
  name: string;
  year: string;
  role: string;
  description: string;
  stack: string[];
  links: ProjectCardLink[];
  newTabLabel: string; // messages.a11y.opensInNewTab, resolvido na página
};

// Estilo do link em ember, SEMPRE sublinhado (significado nunca só por cor —
// daltônico-safe), espelhando o linkClass do MdxAnchor.
const linkClass = cn(
  'text-primary decoration-primary/40 font-medium underline underline-offset-2',
  'transition-colors hover:decoration-primary',
);

// Card de um projeto: ano em mono na coluna fixa à esquerda (alinha com Timeline/Awards),
// conteúdo à direita. Apresentacional/server: a página resolve idioma e rótulos antes de
// passar — props são string, nunca LocalizedText.
export function ProjectCard({
  name,
  year,
  role,
  description,
  stack,
  links,
  newTabLabel,
}: ProjectCardProps) {
  return (
    <div className="grid grid-cols-1 gap-2 py-6 first:pt-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
      <p className="text-muted-foreground font-mono text-sm">
        <time dateTime={year}>{year}</time>
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-foreground font-medium text-pretty">{name}</h2>
          <p className="text-muted-foreground text-sm">{role}</p>
        </div>
        <p className="text-muted-foreground text-pretty">{description}</p>
        {stack.length > 0 && (
          <ul className="mt-1 flex flex-wrap items-center gap-2">
            {stack.map((tech) => (
              <li key={tech}>
                <MonoTag size="sm">{tech}</MonoTag>
              </li>
            ))}
          </ul>
        )}
        {links.length > 0 && (
          <ul className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
            {links.map((link) => (
              <li key={link.kind}>
                <ProjectLinkAnchor link={link} newTabLabel={newTabLabel} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Link externo no padrão da casa (espelha o ramo externo de MdxAnchor): nova aba, rel
// seguro, glifo ↗ (sinal além da cor) + texto sr-only pro leitor anunciar a nova aba.
function ProjectLinkAnchor({ link, newTabLabel }: { link: ProjectCardLink; newTabLabel: string }) {
  return (
    <a href={link.href} className={linkClass} target="_blank" rel="noopener noreferrer">
      {link.label}
      <span aria-hidden className="ml-0.5 font-mono text-sm">
        ↗
      </span>
      <span className="sr-only">{newTabLabel}</span>
    </a>
  );
}

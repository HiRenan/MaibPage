import { MonoTag } from '@/components/ui/mono-tag';

type SkillGroupProps = {
  label: string;
  skills: string[];
};

// Uma categoria de skills: kicker mono ▸ na coluna esquerda (alinha com as datas da
// Timeline), chips MonoTag à direita. Apresentacional; a página resolve o label
// (messages) e a ordem (sortSkillGroups). O ▸ é aria-hidden -> fica fora do nome
// acessível do heading.
export function SkillGroup({ label, skills }: SkillGroupProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
      <h3 className="text-muted-foreground font-mono text-sm font-medium tracking-[0.12em] whitespace-nowrap">
        <span aria-hidden>▸ </span>
        {label}
      </h3>
      <ul className="flex flex-wrap items-center gap-2">
        {skills.map((skill) => (
          <li key={skill}>
            <MonoTag size="sm">{skill}</MonoTag>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Projetos do Renan Mocelin — DADOS, não LABELS.
//
// Convenção (espelha data/experience.ts): name, year, stack e links são
// locale-neutral; só role/description variam por idioma ({ pt, en }). Os LABELS de
// UI (título da página, lead, rótulos dos links) vivem em messages, namespace
// "projects". year em 'YYYY': string locale-neutral, exibida em mono como está e
// válida pra <time dateTime>.

export type LocalizedText = { pt: string; en: string };

// Link externo do projeto. `kind` escolhe o rótulo (messages.projects.links[kind]);
// a página resolve o texto antes de passar pro card.
export type ProjectLink = { kind: 'repo' | 'demo'; href: string };

export type Project = {
  name: string;
  year: string; // 'YYYY' — ponto no tempo, exibido em mono
  role: LocalizedText;
  description: LocalizedText;
  stack: string[];
  links: ProjectLink[];
  featured?: boolean;
};

// Ordena featured-first, preservando a ordem de origem dentro de cada grupo (sort
// estável). Puro, não muta a entrada — espelha sortSkillGroups de data/experience.ts.
export function sortProjects(items: Project[]): Project[] {
  return [...items].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
}

// --- DADOS (MAI-565) ---
// Ordem de origem = ordem de exibição dentro de cada grupo featured/não-featured.
// Métricas/prêmios NÃO inventados: onde há colocação, o texto é reusado VERBATIM do
// award correspondente em data/experience.ts (evita o site afirmar o mesmo de 2 jeitos).

export const projects: Project[] = [
  {
    name: 'IGNITE',
    year: '2026',
    // rascunho — Renan confere o papel exato no time do hackathon.
    role: { pt: 'Equipe (hackathon)', en: 'Team (hackathon)' },
    description: {
      // Colocação reusada VERBATIM do award ActInSpace (data/experience.ts).
      pt: "Imageria de satélite, 'seeing the unseen, from space'. 1º lugar, representando o Brasil na final mundial na França.",
      en: "Satellite imagery, 'seeing the unseen, from space'. 1st place, representing Brazil in the global final in France.",
    },
    stack: ['React', 'Vite', 'JavaScript'],
    links: [
      { kind: 'repo', href: 'https://github.com/HiRenan/ignite-team' },
      { kind: 'demo', href: 'https://ignite-khaki-six.vercel.app' },
    ],
    featured: true,
  },
  {
    name: 'MaibPage',
    year: '2026',
    role: { pt: 'Autor e desenvolvedor', en: 'Author and developer' },
    description: {
      pt: 'O site que você está lendo. Marca pessoal e presença da MAIB em PT e EN, com design system dark anti-neon em OKLCH (contraste WCAG validado por script), blog em MDX e paleta ⌘K. Construído num fluxo de dois terminais: um constrói, o outro verifica.',
      en: 'The site you are reading. Personal brand and MAIB presence in PT and EN, with a dark anti-neon design system in OKLCH (WCAG contrast validated by script), an MDX blog, and a ⌘K palette. Built in a two-terminal flow: one builds, the other verifies.',
    },
    stack: ['Next.js 16', 'TypeScript', 'MDX', 'Tailwind', 'next-intl'],
    links: [
      { kind: 'repo', href: 'https://github.com/HiRenan/MaibPage' },
      { kind: 'demo', href: 'https://maib.com.br' },
    ],
    featured: true,
  },
  {
    name: 'CortAI',
    year: '2025',
    // rascunho — Renan confere papel e stack.
    role: { pt: 'Desenvolvedor', en: 'Developer' },
    description: {
      pt: 'Geração de múltiplos cortes de mídia em tempo real com inteligência multimodal.',
      en: 'Real-time generation of multiple media clips with multimodal intelligence.',
    },
    // rascunho — stack a confirmar.
    stack: ['Python', 'IA generativa', 'Multimodal'],
    links: [{ kind: 'repo', href: 'https://github.com/HiRenan/CortAI' }],
    // TODO (Renan): confirmar se este é o projeto do AKCIT 2025. Se for, anexar à
    // description o texto EXATO do award em data/experience.ts:
    //   pt "2º lugar, com projeto de IA generativa." / en "2nd place, with a generative AI project."
    // A colocação já é fato verificado; só a ligação CortAI <-> AKCIT falta confirmar.
  },
  {
    name: 'TinyML HAR',
    year: '2026',
    // rascunho — Renan confere papel e stack.
    role: { pt: 'Desenvolvedor', en: 'Developer' },
    description: {
      pt: 'Reconhecimento de atividade humana (dataset UCI HAR) rodando direto num microcontrolador ESP32-S3 com TinyML, lendo um sensor MPU6050. IA na borda, sem nuvem.',
      en: 'Human activity recognition (UCI HAR dataset) running directly on an ESP32-S3 microcontroller with TinyML, reading an MPU6050 sensor. AI at the edge, no cloud.',
    },
    stack: ['C', 'ESP32-S3', 'TensorFlow Lite Micro', 'TinyML'],
    links: [{ kind: 'repo', href: 'https://github.com/HiRenan/uci_har_tinyml' }],
  },
];

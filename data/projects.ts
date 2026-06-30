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
    role: { pt: 'Desenvolvedor', en: 'Developer' },
    description: {
      // Conquista reusada do award ActInSpace (data/experience.ts): o mesmo Airbus Prize.
      pt: "Imageria de satélite, no tema 'seeing the unseen, from space'. Ganhou o Airbus Prize, o prêmio especial da Airbus na final mundial do ActInSpace 2026, em Bordeaux, representando o Brasil.",
      en: "Satellite imagery, on the theme 'seeing the unseen, from space'. It won the Airbus Prize, Airbus's special award at the ActInSpace 2026 world final in Bordeaux, representing Brazil.",
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
    role: { pt: 'Desenvolvedor', en: 'Developer' },
    description: {
      // Colocação confirmada pelo Renan: CortAI é o projeto do AKCIT 2025 (2º lugar).
      pt: 'Geração de múltiplos cortes de mídia em tempo real com inteligência multimodal. Levou o 2º lugar no AKCIT 2025.',
      en: 'Real-time generation of multiple media clips with multimodal intelligence. It took 2nd place at AKCIT 2025.',
    },
    stack: ['Python', 'IA generativa', 'Multimodal'],
    links: [{ kind: 'repo', href: 'https://github.com/HiRenan/CortAI' }],
  },
  {
    name: 'TinyML HAR',
    year: '2026',
    role: { pt: 'Desenvolvedor', en: 'Developer' },
    description: {
      pt: 'Projeto da residência em IA no SENAI: reconhecimento de atividade humana (dataset UCI HAR) rodando direto num microcontrolador ESP32-S3 com TinyML, lendo um sensor MPU6050. IA na borda, sem nuvem.',
      en: 'A project from my AI residency at SENAI: human activity recognition (UCI HAR dataset) running directly on an ESP32-S3 microcontroller with TinyML, reading an MPU6050 sensor. AI at the edge, no cloud.',
    },
    stack: ['C', 'ESP32-S3', 'TensorFlow Lite Micro', 'TinyML'],
    links: [{ kind: 'repo', href: 'https://github.com/HiRenan/uci_har_tinyml' }],
  },
];

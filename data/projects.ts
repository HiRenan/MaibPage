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
// Métricas/prêmios NÃO inventados: onde há colocação, os fatos seguem o award
// correspondente em data/experience.ts.

export const projects: Project[] = [
  {
    name: 'IGNITE',
    year: '2026',
    role: { pt: 'Desenvolvedor', en: 'Developer' },
    description: {
      // Mesma conquista registrada no award ActInSpace em data/experience.ts.
      pt: "Projeto de imagens de satélite criado para o desafio 'seeing the unseen, from space'. Com ele, a equipe ganhou o Airbus Prize na final mundial do ActInSpace 2026, em Bordeaux, representando o Brasil.",
      en: "A satellite imagery project built for the 'seeing the unseen, from space' challenge. It won the Airbus Prize at the ActInSpace 2026 world final in Bordeaux, representing Brazil.",
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
      pt: 'É o site que você está lendo. Fiz em PT e EN, com blog em MDX, paleta ⌘K e um design system dark anti-neon em OKLCH. Um script confere o contraste WCAG. No desenvolvimento, uso dois terminais: um implementa e o outro revisa.',
      en: 'This is the site you are reading. I built it in PT and EN with an MDX blog, a ⌘K palette, and a dark anti-neon design system in OKLCH. A script checks WCAG contrast. During development, I use two terminals: one implements and the other reviews.',
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
      pt: 'Ferramenta que usa IA multimodal para gerar vários cortes de mídia em tempo real. Ficou em 2º lugar no AKCIT 2025.',
      en: 'A tool that uses multimodal AI to generate multiple media clips in real time. It placed second at AKCIT 2025.',
    },
    stack: ['Python', 'Generative AI', 'Multimodal'],
    links: [{ kind: 'repo', href: 'https://github.com/HiRenan/CortAI' }],
  },
  {
    name: 'TinyML HAR',
    year: '2026',
    role: { pt: 'Desenvolvedor', en: 'Developer' },
    description: {
      pt: 'Projeto da residência em IA no SENAI. Um modelo de reconhecimento de atividade humana, treinado com o dataset UCI HAR, roda no ESP32-S3 e lê dados de um sensor MPU6050. Tudo acontece na borda, sem nuvem.',
      en: 'A project from my AI residency at SENAI. A human activity recognition model trained on the UCI HAR dataset runs on an ESP32-S3 and reads data from an MPU6050 sensor. Everything happens at the edge, without the cloud.',
    },
    stack: ['C', 'ESP32-S3', 'TensorFlow Lite Micro', 'TinyML'],
    links: [{ kind: 'repo', href: 'https://github.com/HiRenan/uci_har_tinyml' }],
  },
];

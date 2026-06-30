// CV do Renan Mocelin — DADOS, não LABELS.
//
// Convenção (F9 / MAI-502, 506): datas, empresa, instituição e stack são
// locale-neutral; só role/degree/description/result variam por idioma ({ pt, en }).
// Os LABELS de UI (headings, "presente", nomes das categorias) vivem em messages,
// namespace "experience". Datas em 'YYYY' ou 'YYYY-MM' (ex. '2024', '2024-03'):
// string locale-neutral, exibida em mono como está e válida pra <time dateTime>.

// Sentinela de cargo/curso em andamento. No render a Timeline troca por presentLabel
// ("presente"/"present", de messages); nunca renderiza a string crua.
export const PRESENT = 'present';

export type LocalizedText = { pt: string; en: string };

export type ExperienceItem = {
  start: string;
  end: string; // data ('YYYY'|'YYYY-MM') OU o sentinela PRESENT
  role: LocalizedText;
  company: string;
  description: LocalizedText;
  stack: string[];
};

export type EducationItem = {
  start: string;
  end: string; // data ('YYYY'|'YYYY-MM') OU o sentinela PRESENT
  degree: LocalizedText;
  institution: string;
  description?: LocalizedText;
};

// Prêmio/conquista (F9): ponto no tempo, não range. `event` é nome próprio
// (locale-neutral); só `result` (colocação + contexto) varia por idioma.
export type AwardItem = {
  year: string;
  event: string;
  result: LocalizedText;
};

export type SkillCategory = 'frameworks' | 'languages' | 'tools' | 'ai-ml' | 'infra';

export type SkillGroup = {
  category: SkillCategory;
  skills: string[];
};

// Ordem canônica de exibição das categorias (só as presentes entram).
export const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  'frameworks',
  'languages',
  'tools',
  'ai-ml',
  'infra',
];

// Ordena os grupos pela ordem canônica e descarta categorias vazias. Puro, não muta
// a entrada. Tolerante: ordem de entrada e categorias ausentes não importam.
export function sortSkillGroups(groups: SkillGroup[]): SkillGroup[] {
  return groups
    .filter((group) => group.skills.length > 0)
    .sort(
      (a, b) => SKILL_CATEGORY_ORDER.indexOf(a.category) - SKILL_CATEGORY_ORDER.indexOf(b.category),
    );
}

// --- DADOS REAIS (MAI-506) ---
// Curados do CV/LinkedIn pro foco IA/eng. Fora da timeline por decisão do Renan:
// Softplan (2018-2021, pré-tech) e MAIB (marca atual, vive em header/about/contato —
// sem data, pra não ser lida como "empresa nova").

export const experience: ExperienceItem[] = [
  {
    start: '2026-04',
    end: PRESENT,
    role: { pt: 'Engenheiro de IA', en: 'AI Engineer' },
    company: 'Freedom.AI',
    description: {
      pt: 'Agentes de IA e soluções LLM-based: agentes conversacionais e autônomos com orquestração, memória e tool use, sistemas RAG, fine-tuning e MLOps, com observabilidade e proteção contra alucinação e prompt injection.',
      en: 'AI agents and LLM-based solutions: conversational and autonomous agents with orchestration, memory and tool use, RAG systems, fine-tuning and MLOps, with observability and protection against hallucination and prompt injection.',
    },
    stack: ['Python', 'FastAPI', 'Claude', 'RAG', 'PostgreSQL', 'Docker', 'AWS', 'MCP'],
  },
  {
    start: '2025-06',
    end: PRESENT,
    role: { pt: 'Residência em IA', en: 'AI Residency' },
    company: 'SENAI/SC',
    description: {
      pt: 'Programa intensivo de residência em IA: machine learning, deep learning e aprendizado por reforço, visão computacional, IA generativa, big data, otimização e meta-heurísticas, IA embarcada e projetos aplicados.',
      en: 'Intensive AI residency program: machine learning, deep learning and reinforcement learning, computer vision, generative AI, big data, optimization and meta-heuristics, embedded AI, and applied projects.',
    },
    stack: ['Python', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Generative AI'],
  },
  {
    start: '2022-03',
    end: '2025-06',
    role: { pt: 'Analista de Suporte N2', en: 'N2 Support Analyst' },
    company: 'Paradigma Business Solutions',
    description: {
      pt: 'Diagnóstico e correção de problemas em produto direto no banco (T-SQL, triggers, procedures), integrações XML e SOAP e pull requests de correção. Progressão de estagiário a N2, com melhoria de processos e documentação no time de suporte.',
      en: 'Diagnosing and fixing product issues directly in the database (T-SQL, triggers, procedures), XML and SOAP integrations, and fix pull requests. Progressed from intern to N2, improving support-team processes and documentation.',
    },
    stack: ['T-SQL', 'SQL', 'XML', 'SOAP'],
  },
];

export const education: EducationItem[] = [
  {
    start: '2025-06',
    end: '2026-06',
    degree: { pt: 'Pós-graduação em IA Aplicada', en: 'Postgraduate in Applied AI' },
    institution: 'SENAI/SC',
  },
  {
    start: '2020-03',
    end: '2024-06',
    degree: {
      pt: 'Bacharelado em Sistemas de Informação',
      en: "Bachelor's in Information Systems",
    },
    institution: 'Universidade Estácio',
  },
];

export const awards: AwardItem[] = [
  {
    year: '2026',
    event: 'ActInSpace',
    result: {
      pt: 'Airbus Prize, o prêmio especial da Airbus na final mundial, em Bordeaux, representando o Brasil.',
      en: "Airbus Prize, Airbus's special award at the world final in Bordeaux, representing Brazil.",
    },
  },
  {
    year: '2025',
    event: 'AKCIT',
    result: {
      pt: '2º lugar, com projeto de IA generativa.',
      en: '2nd place, with a generative AI project.',
    },
  },
];

export const skills: SkillGroup[] = [
  { category: 'frameworks', skills: ['FastAPI', 'React', 'Node.js'] },
  { category: 'languages', skills: ['Python', 'JavaScript', 'SQL'] },
  { category: 'tools', skills: ['Claude Code', 'MCP', 'Docker', 'Git'] },
  {
    category: 'ai-ml',
    skills: [
      'Deterministic LLM Programming',
      'RAG',
      'Machine Learning',
      'Deep Learning',
      'Computer Vision',
      'Generative AI',
      'Fine-tuning',
      'MLOps',
    ],
  },
  { category: 'infra', skills: ['AWS', 'Bedrock', 'PostgreSQL'] },
];

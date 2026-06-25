import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { bundledThemes } from 'shiki/themes';

const nextConfig: NextConfig = {
  // .md/.mdx contam como extensões válidas de página/conteúdo, ao lado de TS/JS.
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // AVIF/WebP servidos por padrão pelo otimizador do next/image (peso/CLS). Sem
  // imagem no v1 ainda — convenção de uso documentada no README; otimização real
  // (priority, blur) fica pro F17.
  images: { formats: ['image/avif', 'image/webp'] },

  // O route /api/og lê as fontes .woff via fs em runtime (app/api/og/fonts). Sem
  // isto, o output tracing da Vercel pode não incluí-las no bundle da function e o
  // card OG cai na fonte default do Satori em vez da Geist (F16 / MAI-541).
  outputFileTracingIncludes: {
    '/api/og': ['./app/api/og/fonts/**'],
  },

  // Headers de segurança em toda rota (F16 / MAI-546). CSP estrito fica de fora por
  // ora: com App Router + JSON-LD inline + next/og, CSP nonce-based é fiddly e
  // arrisca quebrar render — follow-up dedicado, documentado no ticket.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// AA do comentário (MAI-661, achado no audit MAI-556): o vitesse-dark pinta o token
// `comment` com #758575dd → só 3.74:1 sobre --card. Subimos pra #7d8d7d → 5.09:1
// (AA WCAG ≥ 4.5:1), mantendo o mesmo cinza-esverdeado mudo, só mais legível.
const CODE_COMMENT_AA = '#7d8d7d';

// Config async só pra resolver o tema bundlado do shiki no load. Turbopack serializa a
// config (JS -> Rust): plugins remark/rehype vão como strings / tuplas-string com options
// JSON, nunca funções importadas — e o theme do rehype-pretty-code é um objeto JSON puro
// (vitesse-dark + colorReplacements), que serializa igual. O colorReplacements troca só a
// cor do comentário (escopo `comment`); os demais tokens do tema ficam intactos.
export default async function buildConfig() {
  const vitesseDark = (await bundledThemes['vitesse-dark']()).default;
  const codeTheme = { ...vitesseDark, colorReplacements: { '#758575dd': CODE_COMMENT_AA } };

  const withMDX = createMDX({
    options: {
      // remark-frontmatter transforma o bloco `---...---` num nó yaml: sem ele, o loader
      // renderiza o frontmatter como conteúdo (--- vira <hr>, campos viram texto). A meta
      // continua vindo do gray-matter em lib/posts.ts; aqui só evitamos o vazamento visual.
      remarkPlugins: ['remark-gfm', 'remark-frontmatter'],
      rehypePlugins: [
        // Injeta id slug nos headings (h2/h3) pras âncoras do ToC. github-slugger
        // por baixo → bate com lib/posts.ts (mesma lib, mesmo dedup). MAI-515.
        'rehype-slug',
        // Superfície do bloco vem dos nossos tokens (keepBackground:false); o tema
        // só colore os tokens de sintaxe. Vitesse Dark: off-white quente, anti-neon.
        ['rehype-pretty-code', { theme: codeTheme, keepBackground: false }],
      ],
    },
  });

  // next-intl permanece o wrapper externo já existente; o MDX entra por dentro.
  return withNextIntl(withMDX(nextConfig));
}

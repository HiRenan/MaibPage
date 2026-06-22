import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // .md/.mdx contam como extensões válidas de página/conteúdo, ao lado de TS/JS.
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Turbopack serializa a config (JS -> Rust): plugins remark/rehype vão como
// strings / tuplas-string com options JSON, nunca funções importadas.
const withMDX = createMDX({
  options: {
    // remark-frontmatter transforma o bloco `---...---` num nó yaml: sem ele, o loader
    // renderiza o frontmatter como conteúdo (--- vira <hr>, campos viram texto). A meta
    // continua vindo do gray-matter em lib/posts.ts; aqui só evitamos o vazamento visual.
    remarkPlugins: ['remark-gfm', 'remark-frontmatter'],
    rehypePlugins: [
      // Superfície do bloco vem dos nossos tokens (keepBackground:false); o tema
      // só colore os tokens de sintaxe. Vitesse Dark: off-white quente, anti-neon.
      ['rehype-pretty-code', { theme: 'vitesse-dark', keepBackground: false }],
    ],
  },
});

// next-intl permanece o wrapper externo já existente; o MDX entra por dentro.
export default withNextIntl(withMDX(nextConfig));

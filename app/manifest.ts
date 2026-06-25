import type { MetadataRoute } from 'next';

// Web app manifest. theme/background = carvão quente (--background, hex do token
// OKLCH). Ícones apontam pros routes gerados (icon.svg + apple-icon).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MAIB · Renan Mocelin',
    short_name: 'MAIB',
    description:
      'Marca pessoal do Renan Mocelin e presença da MAIB: IA, automação, Claude Code e desenvolvimento.',
    start_url: '/',
    display: 'standalone',
    background_color: '#110f0d',
    theme_color: '#110f0d',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  };
}

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

// Open Graph social card 1200x630 gerado em runtime. UM template; ?title= e
// ?kicker= viram o card de cada página. "A Oficina Noturna" em miniatura: carvão
// quente, sinal ember <=10% (monograma + 1 ponto), mono pra sinalizar, grotesca
// (Geist) pra ler. Sem glow, sem neon. Mesmos hexes dos tokens OKLCH do design
// system (globals.css) — reuso, jamais cor literal nova.
//
// runtime node: o ImageResponse carrega os .woff via fs; não forçar edge.
export const runtime = 'nodejs';

// Hexes herdados dos tokens OKLCH (globals.css). Conferidos por conversão
// OKLCH->sRGB: --background e --primary batem com #110f0d / #df8537 (apple-icon).
const CARVAO = '#110f0d'; // --background  oklch(0.17  0.006 70)
const LIFT = '#191714'; // --card        oklch(0.205 0.007 70) — lift tonal
const PAPEL = '#e8e4dc'; // --foreground  oklch(0.92  0.012 85)
const MUTED = '#aaa49c'; // --muted-fg    oklch(0.722 0.014 75)
const BORDA = '#35322e'; // --border      oklch(0.32  0.008 72)
const EMBER = '#df8537'; // --primary     oklch(0.7   0.142 58) — o único sinal

// Carrega a fonte do bundle co-localizado. Falha vira null -> ImageResponse usa a
// fonte default (fallback aceitável pra v1, conforme contrato).
const FONT_DIR = join(process.cwd(), 'app/api/og/fonts');
function loadFont(file: string): Buffer | null {
  try {
    return readFileSync(join(FONT_DIR, file));
  } catch {
    return null;
  }
}
const geistBold = loadFont('Geist-700.woff');
const geistMedium = loadFont('Geist-500.woff');
const geistMono = loadFont('GeistMono-500.woff');

// Display nasce de contraste brutal de peso/tamanho, não de outra família: títulos
// curtos enchem o quadro, longos recuam mas continuam dominantes (Sinal > ruído).
function titleSize(len: number): number {
  if (len <= 16) return 96;
  if (len <= 26) return 84;
  if (len <= 40) return 68;
  if (len <= 60) return 56;
  return 48;
}

export function GET(req: Request): ImageResponse {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title')?.trim() || 'maib.com.br').slice(0, 110);
  const kicker = (searchParams.get('kicker')?.trim() || 'maib.com.br').slice(0, 42);

  const fonts: { name: string; data: Buffer; weight: 500 | 700; style: 'normal' }[] = [];
  if (geistBold) fonts.push({ name: 'Geist', data: geistBold, weight: 700, style: 'normal' });
  if (geistMedium) fonts.push({ name: 'Geist', data: geistMedium, weight: 500, style: 'normal' });
  if (geistMono) fonts.push({ name: 'Geist Mono', data: geistMono, weight: 500, style: 'normal' });

  // Marcas de registro nos cantos — "tudo foi medido e montado". Border-gray, não
  // ember: emolduram com precisão sem gastar o sinal. L de 2px em cada canto.
  const TICK = 24;
  const tick = (corner: 'tl' | 'tr' | 'bl' | 'br') => {
    const top = corner[0] === 't';
    const left = corner[1] === 'l';
    return {
      position: 'absolute' as const,
      width: TICK,
      height: TICK,
      [top ? 'top' : 'bottom']: 30,
      [left ? 'left' : 'right']: 30,
      [top ? 'borderTop' : 'borderBottom']: `2px solid ${BORDA}`,
      [left ? 'borderLeft' : 'borderRight']: `2px solid ${BORDA}`,
    };
  };

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 76,
        backgroundColor: CARVAO,
        // Profundidade tonal (não projetada): a bancada acesa embaixo-esquerda.
        backgroundImage: `radial-gradient(115% 120% at 16% 92%, ${LIFT} 0%, ${CARVAO} 58%)`,
        color: PAPEL,
        fontFamily: 'Geist',
      }}
    >
      <div style={tick('tl')} />
      <div style={tick('tr')} />
      <div style={tick('bl')} />
      <div style={tick('br')} />

      {/* Lockup: monograma ember (path reusado do apple-icon) + wordmark mono */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="60" height="60" viewBox="0 0 32 32">
          <path
            d="M8 24 L8 8 L16 17 L24 8 L24 24"
            fill="none"
            stroke={EMBER}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            marginLeft: 20,
            fontFamily: 'Geist Mono',
            fontWeight: 500,
            fontSize: 27,
            letterSpacing: '0.3em',
            color: PAPEL,
          }}
        >
          MAIB
        </div>
      </div>

      {/* Payload centrado no vão: kicker (eyebrow mono) + título dominante */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 22 }}>
          <div style={{ width: 11, height: 11, backgroundColor: EMBER }} />
          <div
            style={{
              marginLeft: 16,
              fontFamily: 'Geist Mono',
              fontWeight: 500,
              fontSize: 25,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            {kicker}
          </div>
        </div>
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            maxWidth: 1010,
            fontFamily: 'Geist',
            fontWeight: 700,
            fontSize: titleSize(title.length),
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            color: PAPEL,
          }}
        >
          {title}
        </div>
      </div>

      {/* Assinatura: a marca puxa em cima (MAIB), a pessoa fecha embaixo (Renan).
            Regra dashed (herança daviaviss) separa payload da assinatura. */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            borderTop: `1px dashed ${BORDA}`,
            marginBottom: 24,
          }}
        />
        <div
          style={{
            fontFamily: 'Geist Mono',
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: '0.22em',
            color: MUTED,
          }}
        >
          RENAN MOCELIN
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts,
      // Mesmo (title,kicker) -> mesmo PNG. Cache longo; tuning de CDN é infra.
      headers: { 'Cache-Control': 'public, immutable, no-transform, max-age=86400' },
    },
  );
}

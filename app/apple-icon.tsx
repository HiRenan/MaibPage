import { ImageResponse } from 'next/og';

// Apple touch icon gerado em runtime (sem asset binário no repo). Monograma M
// ember sobre carvão quente — mesmos hexes dos tokens OKLCH do design system.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#110f0d',
      }}
    >
      <svg width="104" height="104" viewBox="0 0 32 32">
        <path
          d="M8 24 L8 8 L16 17 L24 8 L24 24"
          fill="none"
          stroke="#df8537"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}

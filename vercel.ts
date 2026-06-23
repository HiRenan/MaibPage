import type { VercelConfig } from '@vercel/config/v1';

// Config de deploy da Vercel (ADR D5: vercel.ts, não vercel.json). Mínimo de
// propósito:
//   - framework declarado explícito; build/install/output ficam auto-detectados
//     (pnpm vem do `packageManager` do package.json; Fluid Compute é default).
//   - Headers de segurança vivem no next.config.ts (`headers()`) — idiomático Next
//     e testável localmente com `next start`, sem depender da Vercel.
//   - Redirect apex -> www é resolvido no nível de domínio da Vercel (www como
//     primário), não como regra aqui.
// Este arquivo é a casa pra config Vercel-specific futura (crons, rewrites, regions).
export const config: VercelConfig = {
  framework: 'nextjs',
};

# MaibPage

Site institucional + pessoal sob [maib.com.br](https://maib.com.br) — híbrido pessoal Renan Mocelin + institucional MAIB. Bio, CV, blog (MDX) e conteúdo de IA / Claude Code.

## Status

Greenfield — bootstrap em andamento.

## Roadmap

Tickets e progresso no Linear: [Site MAIB (maib.com.br)](https://linear.app/maib/project/site-maib-maibcombr-b48797e1d06e).

18 fases sequenciais (F1 → F18) cobrindo do scaffold ao QA pré-launch, mais um backlog futuro. Convenção de títulos: `[F<N>] ...` ou `[Backlog] ...`.

## Branches

- `develop` — **default**; toda dev acontece aqui (ou em feature branches que mergem aqui).
- `main` — produção; recebe merges de `develop` via PR estável.

## Stack alvo

Next.js 16 (App Router, RSC) · TypeScript · Tailwind v4 · shadcn/ui · MDX (`@next/mdx` + `gray-matter` + `rehype-pretty-code`/shiki) · next-intl (PT-BR + EN) · cmdk (⌘+K) · Vercel (Fluid Compute, Node 24 LTS, `vercel.ts`).

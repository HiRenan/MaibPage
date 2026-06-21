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

## Desenvolvimento

```sh
pnpm install      # instala dependências
pnpm dev          # dev server (Turbopack) em http://localhost:3000
pnpm build        # build de produção
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier --write
```

### Variáveis de ambiente

Copie `.env.example` → `.env.local` e preencha. `.env.local` é gitignored (nunca commitar). Em produção/preview, sincronize com `vercel env pull`. Apenas `NEXT_PUBLIC_*` vai pro browser; segredos ficam server-only.

## Stack alvo

Next.js 16 (App Router, RSC) · TypeScript · Tailwind v4 · shadcn/ui · MDX (`@next/mdx` + `gray-matter` + `rehype-pretty-code`/shiki) · next-intl (PT-BR + EN) · cmdk (⌘+K) · Vercel (Fluid Compute, Node 24 LTS, `vercel.ts`).

## Instruções pra agentes

- [`CLAUDE.md`](./CLAUDE.md) — Claude Code (inclui seção `Tooling Claude Code neste repo`: `.claude/`, hooks, sub-agents, skills, MCPs).
- [`AGENTS.md`](./AGENTS.md) — Codex, Cursor, Aider, Copilot, Windsurf, Devin e outros (espelho genérico, sem a seção Claude-only).

Os dois arquivos compartilham camada base (Karpathy guidelines) e camada projeto (decisões, antipadrões, invariantes, hot files, stack, git workflow). Mudanças agnósticas de agente devem ser aplicadas nos dois arquivos no mesmo PR.

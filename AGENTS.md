# AGENTS.md

Fonte canônica de instruções para agentes de codificação trabalhando no **MaibPage** (site sob `maib.com.br`). Compatível com [agents.md](https://agents.md) — Codex, Cursor, Aider, Copilot, Windsurf, Devin e outros.

> **Espelho:** este arquivo tem um par em `CLAUDE.md` (com seção adicional `Tooling Claude Code neste repo` cobrindo `.claude/`, hooks, sub-agents, skills, MCPs). Mudanças aqui devem ser refletidas no `CLAUDE.md` no mesmo PR.

> **Camada base — comportamento do agente:** os 4 princípios abaixo vêm de [`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills) (Karpathy guidelines pra reduzir erros comuns de LLM coding). Copiados verbatim aqui pra manter o repo self-contained. Mudanças no comportamento devem **estender**, não substituir, essa base.
>
> **Tradeoff:** essas guidelines pendem pra cautela sobre velocidade. Em tarefas triviais, usar julgamento.

---

## Camada base — Karpathy guidelines (verbatim)

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

> Estas guidelines estão funcionando se: menos mudanças desnecessárias em diffs, menos rewrites por over-complication, e perguntas de clarificação vêm **antes** da implementação, não depois de descobrir o erro.

---

## Camada projeto — MaibPage

### Visão

`maib.com.br` é um site híbrido: marca pessoal do Renan Mocelin + presença institucional da MAIB (CNPJ — consultoria/automação IA). Conteúdo: bio, CV, blog (posts em MDX no repo, escritos via código) e dicas de IA / Claude Code / dev.

Inspirações visuais: [`daviaviss.me`](https://www.daviaviss.me) (base: dark mono, ⌘+K, dashed dividers) + [`luure.carrd.co`](https://luure.carrd.co) (blog: single-column hub linear). Híbrido — layout principal daviaviss, blog index luure.

Repositório: [`HiRenan/MaibPage`](https://github.com/HiRenan/MaibPage) · Branch default: `develop` · Linear: [Site MAIB (maib.com.br)](https://linear.app/maib/project/site-maib-maibcombr-b48797e1d06e).

### Decisões travadas

| # | Decisão | ADR |
|---|---|---|
| D1 | Next.js 16 App Router + RSC default | `docs/decisions/0001-nextjs-16-app-router.md` (DOC12) |
| D2 | MDX no repo (sem CMS externo) | `docs/decisions/0002-mdx-no-repo-vs-cms.md` (DOC12) |
| D3 | `next-intl` com segmento `[locale]` PT-BR + EN | `docs/decisions/0003-i18n-segment-pt-en.md` (DOC12) |
| D4 | Direção visual híbrida daviaviss × luure | `docs/decisions/0004-design-direction-daviaviss-luure.md` (DOC12) |
| D5 | Vercel + Fluid Compute + `vercel.ts` (não `vercel.json`) | `docs/decisions/0005-vercel-deploy.md` (DOC12) |
| D6 | Tailwind v4 + shadcn/ui · Dark mono default · Sem light no v1 | (inline aqui) |
| D7 | Branch `develop` é default; `main` recebe merges em release | (inline aqui) |

### Antipadrões — não fazer no MaibPage

- **Strings hardcoded em UI** — tudo via `useTranslations()` / `getTranslations()`, chaves em `messages/{pt,en}.json`.
- **Cor literal** (`text-[#abc]`, `bg-#222`) — sempre via tokens (`text-foreground`, `bg-background`, `text-muted-foreground`).
- **Pages Router patterns** (`getStaticProps`, `getServerSideProps`, `_app.tsx`, `_document.tsx`) — App Router only.
- **Duplicar primitive shadcn** — se já tem `Button`/`Dialog`/`Command` em `components/ui/`, use; não reescreva.
- **`<img>` em vez de `next/image`** — sempre `next/image`, com `sizes` correto.
- **`'use client'` por preguiça** — Server Components default; só vira client se realmente precisar de hook/event/browser API.
- **Componente sem variantes a11y** — todo interativo tem `aria-label` (se sem texto), foco visível, suporte a teclado.
- **PR sem teste** — toda lógica nova em `lib/`/`utils/` ganha teste Vitest; componentes complexos ganham teste RTL.

### Invariantes — sempre verdadeiros no projeto

- **i18n simétrico:** cada post MDX existe em `pt` E `en` OU tem fallback explícito documentado no frontmatter.
- **Roteamento respeita locale:** toda navegação interna (`<Link>`) usa `next-intl/navigation`, nunca `<a href="/...">` cru. `LocaleSwitcher` preserva pathname ao trocar.
- **Tokens do design system:** zero cor/spacing/typography literal fora de `tailwind.config.ts` + `globals.css`. Toda nova cor passa pelo design system.
- **Server-first:** novo arquivo `.tsx` é Server Component por default. `'use client'` é uma decisão deliberada e justificada.
- **Frontmatter MDX validado:** todo `.mdx` em `content/posts/` passa pelo schema zod definido em `lib/posts.ts`. Build falha se inválido.
- **Sem secrets no client:** `NEXT_PUBLIC_*` apenas para o que pode ir pro browser. Tudo mais lê via Server Component / Server Action.

### Hot files — exigem confirmação antes de editar

Mudanças nesses arquivos têm blast radius alto. Antes de editar, parar e perguntar:

- `app/[locale]/layout.tsx` — root layout, providers, fontes
- `middleware.ts` — detecção de locale, redirects globais
- `next.config.mjs` — config Next, MDX plugin, rewrites
- `vercel.ts` — config de deploy, headers, redirects, cache
- `messages/pt.json` e `messages/en.json` — schemas i18n (renomes quebram chamadas)
- `.gitignore`, `.env.example` — escopo do que vaza pro git/runtime

### Stack & comandos comuns

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · `@next/mdx` + `gray-matter` + `rehype-pretty-code` (shiki) · `next-intl` · `cmdk` (⌘+K) · Vercel.

**Comandos:**

```sh
pnpm dev          # Next dev server (Turbopack)
pnpm build        # Build de produção
pnpm start        # Servir build local
pnpm lint         # ESLint
pnpm format       # Prettier write
pnpm typecheck    # tsc --noEmit
```

### Workflow git & branches

- `develop` é a branch **default**. Toda dev acontece em `develop` ou em feature branches que mergem em `develop`.
- `main` recebe merges de `develop` em releases estáveis (a definir cadência).
- **Commits:** mensagens em PT-BR ou EN, formato conventional commits quando fizer sentido (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`). Mensagem curta e clara > prefixo cerimonial vazio.
- **Nunca:** `git push --force` (especialmente em `main`/`develop`), `git reset --hard` sem confirmar, pular hooks com `--no-verify`.
- **Linear:** issue ID no commit/PR quando aplicável (`MAI-N`). Mover status: Backlog → In Progress → In Review → Done.

### Quando estiver em dúvida

1. Reler a camada base (Karpathy guidelines acima).
2. Checar o ADR relevante em `docs/decisions/` (quando DOC12 estiver pronto).
3. Olhar tickets relacionados no Linear (`https://linear.app/maib`).
4. Se ainda não claro — **perguntar**. Princípio 1: surface confusion.

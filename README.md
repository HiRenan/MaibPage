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

## Qualidade (Lighthouse)

Auditoria Lighthouse 13.4.0, preset **desktop**, contra um build de produção local (`pnpm build && pnpm start`), nas 4 páginas-chave:

| Página                        | Performance | Acessibilidade | Best Practices | SEO |
| ----------------------------- | :---------: | :------------: | :------------: | :-: |
| Home (`/pt`)                  |     100     |      100       |      96 ¹      | 100 |
| Experience (`/pt/experience`) |     100     |      100       |      96 ¹      | 100 |
| Blog (`/pt/blog`)             |     100     |      100       |      96 ¹      | 100 |
| Post (`/pt/blog/hello-world`) |     100     |      100       |      96 ¹      | 100 |

¹ **Best Practices** — o único desconto é `errors-in-console`: os scripts `/_vercel/insights/script.js` e `/_vercel/speed-insights/script.js` (Analytics + Speed Insights) retornam 404 sob `next start` local, pois são servidos pela infra da Vercel. Em produção carregam normalmente → **100**.

> **SEO/canonical:** medido contra build servido em `localhost` com `canonical` = origem. Um build com `NEXT_PUBLIC_SITE_URL` = `www.maib.com.br` servido em localhost mostra SEO **92** (o audit `rel=canonical` acusa origem divergente) — artefato de ambiente que não ocorre em produção, onde a origem é o próprio www.

## Conteúdo (blog)

Posts são arquivos MDX no repositório, em `content/posts/`, um por idioma:

```
content/posts/<slug>.<lang>.mdx   # lang ∈ pt | en
```

- **`<lang>` vem do nome do arquivo** — é a fonte da verdade do idioma (não há campo `lang` no frontmatter).
- **Frontmatter** (validado por schema zod em `lib/posts.ts`; inválido quebra o build): `title`, `description`, `date` (ISO, ex. `'2026-06-21'`), `tags` (`string[]`, default `[]`), `fallback` (`boolean`, default `false`).
- **Simetria i18n (invariante):** cada `slug` existe em `pt` E `en`. Um slug presente só num idioma quebra o build, a menos que declare `fallback: true` no frontmatter pra documentar a lacuna.

O indexador em `lib/posts.ts` é a fonte única: lê, valida, ordena por data desc e expõe `getAllPosts(locale)` (índice do blog) e `getPostCommandItems(locale)` (paleta ⌘K).

## Imagens

Sempre `next/image` — nunca `<img>` cru. Convenção pra evitar CLS e peso:

- **`sizes` correto** sempre que a imagem é responsiva (`fill` ou `width`/`height` fluido), pro browser baixar a resolução certa.
- **`width`/`height` explícitos** (ou `fill` + container com dimensão) — reserva o espaço e evita layout shift.
- **`priority`** só na imagem do LCP (above-the-fold); o resto carrega lazy por default.
- AVIF/WebP saem automáticos do otimizador (`images.formats` no `next.config.ts`).

Em MDX, o componente `MdxImage` (`mdx-components.tsx`) já aplica isso: passe `width`/`height` no markdown (`![alt](src){ width=W height=H }`) pra modo dimensionado, ou omita pra modo responsivo (`sizes="100vw"`).

## Stack alvo

Next.js 16 (App Router, RSC) · TypeScript · Tailwind v4 · shadcn/ui · MDX (`@next/mdx` + `gray-matter` + `rehype-pretty-code`/shiki) · next-intl (PT-BR + EN) · cmdk (⌘+K) · Vercel (Fluid Compute, Node 24 LTS, `vercel.ts`).

## Instruções pra agentes

- [`CLAUDE.md`](./CLAUDE.md) — Claude Code (inclui seção `Tooling Claude Code neste repo`: `.claude/`, hooks, sub-agents, skills, MCPs).
- [`AGENTS.md`](./AGENTS.md) — Codex, Cursor, Aider, Copilot, Windsurf, Devin e outros (espelho genérico, sem a seção Claude-only).

Os dois arquivos compartilham camada base (Karpathy guidelines) e camada projeto (decisões, antipadrões, invariantes, hot files, stack, git workflow). Mudanças agnósticas de agente devem ser aplicadas nos dois arquivos no mesmo PR.

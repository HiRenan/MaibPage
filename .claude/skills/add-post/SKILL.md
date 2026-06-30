---
name: add-post
description: >-
  Scaffold de um novo post de blog em MDX nos dois locales (pt + en), com
  frontmatter já válido pelo schema zod. Use ao criar/adicionar um post do blog.
argument-hint: '[título] [tags] [primaryLocale]'
allowed-tools: Read, Glob, Write, Bash
shell: bash
---

# /add-post — scaffold de post MDX (pt + en)

Cria `content/posts/<slug>.pt.mdx` e `content/posts/<slug>.en.mdx` simétricos, com
frontmatter já válido pelo zod de `lib/posts.ts`, prontos pra escrever a prosa.

**Data de hoje (use no campo `date`):** !`date +%F`
_(se vier vazio, use a data atual conhecida no formato `YYYY-MM-DD`.)_

## Entradas

`$ARGUMENTS` pode trazer título, tags e locale primário. O que faltar, **pergunte**:

- **título** — no idioma primário
- **tags** — lista curta, kebab-case (ex: `claude-code`, `ai`, `workflow`)
- **primaryLocale** — `pt` ou `en` (qual idioma você escreve primeiro)

## Passos

1. **Slug** — derive um slug **em inglês**, kebab-case. Convenção da casa: slugs em
   inglês mesmo pra posts PT (ex: `hello-world`, `two-terminals`, `less-context`).
   Valide contra `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Se ambíguo, confirme comigo.
2. **Colisão** — `Glob content/posts/<slug>.*.mdx`. Se já existe, pare e avise.
3. **Escreva os 2 arquivos** com este frontmatter (strings em aspas simples, `date`
   ISO em aspas, **sem** `fallback` — simétrico por padrão):

   ```mdx
   ---
   title: '<título no idioma do arquivo>'
   description: '<1 linha, no idioma do arquivo>'
   date: '<YYYY-MM-DD de hoje>'
   tags: ['<tag1>', '<tag2>']
   ---

   <parágrafo de abertura: 2 frases curtas. TODO escrever.>

   ## <seção 1>

   <TODO>

   ## <seção 2>

   <TODO>

   ## <seção 3>

   <TODO>

   > <aforismo de fechamento. TODO>
   ```

   - O arquivo do **primaryLocale** entra com `title`/`description` reais; o outro
     idioma recebe os mesmos campos marcados `TODO traduzir`.
   - Mínimo **2 headings `##`** pro ToC renderizar (deixei 3 de placeholder).

4. **Confirme** os dois caminhos criados e lembre das regras abaixo.

## Regras (invariantes — não furar)

- **Simetria pt/en:** os 2 arquivos existem com o mesmo slug. Assimetria quebra o
  build, salvo `fallback: true` documentado (evite).
- **Voz (PRODUCT.md):** direta, técnica, sem marketing-ês, sem floreio; fechamento
  aforístico. Fala com um par técnico.
- **Sem em dash** na copy (regra da casa): use dois pontos, vírgula ou reescreva.
- **Frontmatter é validado no build** (zod): `title`/`description` não-vazios,
  `date` parseável, `tags` lista de strings.
- A **prosa vem depois** — este skill só scaffolda a estrutura.

Não rode build aqui; quem valida é o `pnpm build` e o agent `code-reviewer`.

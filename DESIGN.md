---
name: maib.com.br
description: Hub de autoridade do Renan Mocelin + presença da MAIB. Dark anti-neon, tipografia de instrumento, vidro só no ⌘+K.
---

<!-- SEED: re-rode /impeccable document quando houver código (tokens em globals.css, componentes em components/ui) pra extrair os valores reais e gerar o sidecar .impeccable/design.json. -->

# Design System: maib.com.br

## 1. Overview

**Creative North Star: "A Oficina Noturna"**

A bancada de um engenheiro de precisão depois do expediente: luz baixa e quente, o
escuro do ambiente continuando dentro da tela, ferramentas exatas ao alcance da
mão. O brilho na sala é o _trabalho_ aceso, não decoração pregada na parede. Tudo
que está à vista foi medido e montado, porque aqui o craft é o argumento: um site
sobre engenharia de IA tem que ser, ele mesmo, precisamente engenheirado.

A densidade é generosa e o silêncio é proposital. O visitante é técnico, lê de
madrugada, escaneia rápido; cada elemento ganha o seu lugar ou sai de cena. A
vanguarda não vem de efeito, vem de execução: uma entrada coreografada por jornada,
uma paleta ⌘+K que materializa como instrumento, tipografia que corta com peso em
vez de gritar com cor. Experimentação, sempre controlada.

O sistema rejeita, por nome, dois reflexos: a **IA genérica** (neon, roxo,
gradiente cyberpunk, glow, dark-com-brilho, o visual "startup de IA 2023") e o
**SaaS corporativo frio com stock-IA** (hero-métrica, grade de cards idênticos,
cérebro-de-néon, robô, circuito azul). O dark aqui é instrumento de precisão, não
estética de ferramenta.

**Key Characteristics:**

- Dark anti-neon **quente**: carvão quente quase-preto, texto cor-de-papel, zero glow.
- **Mono + 1 sinal quente**: contraste e peso carregam; um acento ember ocupa ≤10%.
- **Dois registros tipográficos**: grotesca de precisão pra ler, mono de instrumento pra sinalizar.
- **Plano por padrão**; a única profundidade real é o vidro da paleta ⌘+K.
- **Uma entrada-assinatura por jornada**; o resto é resposta. `prefers-reduced-motion` respeitado.
- **Sinal sobre ruído**: densidade generosa, nada decorativo sobrevive.

**A Regra da Entrada Única.** Uma coreografia de entrada por jornada, deliberada
(ex. o hero da home). Todo o resto é resposta: hover, foco, estado, abrir/fechar
⌘+K. `prefers-reduced-motion` mata a entrada e entrega o estático. Sem bounce, sem
elástico; ease-out exponencial.

## 2. Colors

Monocromático quente com um único sinal: a tela inteira vive numa faixa de carvão
quente a papel, e um acento ember aparece raro, só onde precisa apontar. _(Valores
exatos a resolver na implementação, em OKLCH; o projeto tem doutrina de tokens, sem
cor literal fora de `globals.css`.)_

### Primary

- **Sinal Ember** (`[a resolver na implementação — OKLCH, família quente: ember/âmbar/cobre]`): links, foco, estado ativo, item selecionado na ⌘+K. Restrito a ≤10% de qualquer tela. Nunca roxo, nunca azul-elétrico, nunca neon.

### Neutral

- **Carvão Quente** (`[a resolver — quase-preto com leve chroma quente]`): fundo base. Tintado na direção da marca, jamais `#000` puro.
- **Papel** (`[a resolver — off-white quente]`): texto de corpo e títulos. Jamais `#fff` puro.
- **Cinzas intermediários** (`[a resolver — rampa quente]`): texto secundário, bordas, divisores (dashed, herança daviaviss).

### Named Rules

**A Regra do Mono Quente.** O acento cromático ocupa ≤10% de qualquer tela e vive
só na família quente. A raridade é o ponto: quando tudo é sinal, nada é. Contraste
e peso fazem o trabalho pesado; a cor só aponta.

**A Regra da Luz, Não do Glow.** Ênfase e profundidade vêm de luminosidade (mais
claro = mais perto/ativo), nunca de brilho emissivo, halo ou sombra colorida. Se
parece que está aceso por dentro, está errado.

## 3. Typography

**Display / Headings:** neo-grotesque de precisão `[a escolher na implementação — candidatos: ABC Diatype, Söhne, PP Neue Montreal]`
**Body:** a mesma grotesca, peso regular, para leitura longa
**Label / Mono / Código / ⌘+K:** mono de instrumento `[a escolher — candidatos: Berkeley Mono, Söhne Mono, MD IO]`

**Character:** uma grotesca exata e sem maneirismo faz o trabalho de ler; um mono
de instrumento entra como sinal técnico, não como fantasia de terminal. Não há
terceira fonte: o display nasce de contraste brutal de peso e tamanho dentro da
grotesca, não de uma família decorativa. Geist (default do scaffold) é substituído
por escolha deliberada.

### Hierarchy

- **Display** (peso alto, `clamp()` generoso, line-height ~1): heros e marcos. Contraste de peso ≥1.25 entre passos.
- **Headline / Title**: seções e títulos de post.
- **Body** (peso regular): corpo. Largura 65–75ch; line-height folgado no dark quente (luz no escuro pede +0.05–0.1).
- **Label / Mono** (mono, tracking levemente aberto, caixa alta curta): metadados, kbd, código inline, comandos da ⌘+K.

### Named Rules

**A Regra dos Dois Registros.** Grotesca pra ler, mono pra sinalizar. O mono nunca
carrega corpo longo de blog (cansa, briga com a leitura AAA); a grotesca nunca
finge ser código. Cada uma no seu trabalho.

## 4. Elevation

Plano por padrão. O motion é "uma entrada + responsivo", não interface levitando:
superfícies descansam no plano, sem sombra decorativa, sem cards flutuando. A
profundidade é tonal (camadas de carvão), não projetada.

Há **uma** exceção, e só uma: o vidro da paleta **⌘+K**, frosted matte, flutuando
sobre a página com a metáfora Spotlight/Raycast. É o único lugar onde há blur e
profundidade real, porque é o único lugar com conteúdo atrás pra refratar.

### Named Rules

**A Regra do Plano com Uma Exceção de Vidro.** Superfícies são planas em repouso. O
único vidro do sistema é a ⌘+K; o vidro nunca toca o corpo do blog (blur atrás de
texto destrói o contraste AAA) e nunca vira material de card fixo. Glassmorphism
como default é proibido.

## 5. Components

_Modo seed: ainda não há biblioteca de componentes (só `LocaleSwitcher`, que é
plumbing de i18n). Toolkit travado: shadcn/ui sobre Tailwind v4. Quando os
primitivos existirem, re-rodar `/impeccable document` em scan mode preenche esta
seção e gera o sidecar._

**Componente-assinatura a construir: a paleta ⌘+K** (`cmdk`). Frosted matte sobre a
página, item ativo marcado pelo Sinal Ember, mono nos comandos. É o momento de
vanguarda do sistema e o único vidro. Tratar como peça de identidade, não como
busca genérica.

## 6. Do's and Don'ts

### Do:

- **Do** manter o acento Ember em ≤10% da tela; deixar contraste e peso carregarem o resto (A Regra do Mono Quente).
- **Do** tintar todo neutro na direção quente; jamais `#000` ou `#fff` puros.
- **Do** usar a grotesca pra ler e o mono só pra sinalizar (A Regra dos Dois Registros).
- **Do** segurar o corpo do blog em 65–75ch, com line-height folgado e contraste AAA no dark quente.
- **Do** reservar uma única entrada coreografada por jornada; o resto responde. Honrar `prefers-reduced-motion`.
- **Do** usar vidro só na ⌘+K, frosted matte, com conteúdo real atrás.
- **Do** transmitir significado sempre por cor + peso/ícone/texto, nunca por cor sozinha (daltônico-safe).

### Don't:

- **Don't** cair na **IA genérica**: neon, roxo/violeta/azul-elétrico, gradiente cyberpunk, glow, halo, "partículas de IA", dark-com-brilho. O visual "startup de IA 2023" é proibido.
- **Don't** usar **SaaS corporativo frio + stock-IA**: hero-métrica, grade de cards idênticos, imagem stock de IA (cérebro brilhante, robô, circuito azul).
- **Don't** fazer **cosplay de terminal/hacker**: chuva de Matrix, CLI falso, ">\_" decorativo, ASCII gratuito. Mono com precisão sim; fantasia não.
- **Don't** virar **dev-influencer / Linktree**: nome em gradiente, selos "building in public", grade de cards-link.
- **Don't** usar glassmorphism como default, gradient text (`background-clip: text`), side-stripe borders (`border-left` colorido > 1px), nem animar propriedades de layout.
- **Don't** deixar o vidro tocar o corpo do texto, nem pôr luz colorida atrás do vidro (vira o neon que a marca bane).

import { notFound } from 'next/navigation';

// Catch-all: qualquer rota desconhecida sob um locale cai no not-found
// localizado (padrão next-intl). As páginas reais (about/experience/blog)
// chegam em fases futuras e terão precedência sobre este segmento.
export default function CatchAllPage() {
  notFound();
}

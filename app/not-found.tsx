import Link from 'next/link';

import './globals.css';

// Fallback global pra requisições fora do segmento [locale] (sem contexto de
// i18n). Raro — o proxy prefixa locale em quase tudo. Como aqui não dá pra saber o
// idioma de quem chegou, a página fala os dois (strings fixas: sem next-intl aqui),
// e a parte em inglês leva lang="en" pro leitor de tela trocar a pronúncia.
export default function GlobalNotFound() {
  return (
    <html lang="pt">
      <body className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center antialiased">
        {/* Sem metadata fora do [locale]: o React 19 sobe o <title> pro <head> (WCAG 2.4.2). */}
        <title>Página não encontrada · Page not found</title>
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Página não encontrada
          <span lang="en" className="text-muted-foreground mt-1 block text-lg font-normal">
            Page not found
          </span>
        </h1>
        <Link
          href="/"
          className="text-primary duration-base ease-out-expo text-sm underline-offset-4 transition-colors hover:underline"
        >
          Voltar ao início <span aria-hidden>·</span> <span lang="en">Back to home</span>
        </Link>
      </body>
    </html>
  );
}

import Link from 'next/link';

import './globals.css';

// Fallback global pra requisições fora do segmento [locale] (sem contexto de
// i18n). Raro — o proxy prefixa locale em quase tudo. Estático, em PT (default).
export default function GlobalNotFound() {
  return (
    <html lang="pt">
      <body className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center antialiased">
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Página não encontrada
        </h1>
        <Link
          href="/"
          className="text-primary text-sm underline-offset-4 transition-colors hover:underline"
        >
          Voltar ao início
        </Link>
      </body>
    </html>
  );
}

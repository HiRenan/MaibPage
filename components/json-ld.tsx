// <script type="application/ld+json"> reusável (server component, sem 'use client').
// Person na home, BlogPosting em cada post (builders em @/lib/seo). O escape de "<"
// pra < impede que um título com "</script>" quebre o documento (XSS-safe).
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ProjectCard } from '@/components/projects/project-card';
import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import { projects, sortProjects } from '@/data/projects';
import { routing } from '@/i18n/routing';
import { hreflangAlternates, ogImagePath } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'projects' });

  // Rota (não post) -> existe em todos os locales -> hreflang completo (lib/seo).
  const ogTitle = t('title');

  return {
    title: t('metaTitle'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: hreflangAlternates((l) => `/${l}/projects`),
    },
    openGraph: {
      type: 'website',
      url: `/${locale}/projects`,
      images: [{ url: ogImagePath(ogTitle), width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const newTabLabel = t('a11y.opensInNewTab');
  const repoLabel = t('projects.links.repo');
  const demoLabel = t('projects.links.demo');

  // DADOS (data/projects.ts) -> props string, escolhendo o idioma do locale.
  // name/year/stack/links são locale-neutral; role/description variam. A LISTA é dona
  // do DashedDivider entre os cards (mesmo padrão de Timeline/Awards).
  return (
    <Container size="sm" className="flex flex-col py-20 sm:py-28">
      <header className="flex flex-col gap-4">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t('projects.title')}
        </h1>
        <p className="text-muted-foreground text-lg text-pretty">{t('projects.lead')}</p>
      </header>

      <DashedDivider className="my-12" />

      <div className="flex flex-col">
        {sortProjects(projects).map((project, index) => (
          <Fragment key={project.name}>
            {index > 0 && <DashedDivider className="my-0" />}
            <ProjectCard
              name={project.name}
              year={project.year}
              role={project.role[locale]}
              description={project.description[locale]}
              stack={project.stack}
              links={project.links.map((link) => ({
                kind: link.kind,
                href: link.href,
                label: link.kind === 'repo' ? repoLabel : demoLabel,
              }))}
              newTabLabel={newTabLabel}
            />
          </Fragment>
        ))}
      </div>
    </Container>
  );
}

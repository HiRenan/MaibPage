import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Fragment, type ReactNode } from 'react';

import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Awards, type AwardEntry } from '@/components/experience/awards';
import { SkillGroup } from '@/components/experience/skill-group';
import { Timeline, type TimelineEntry } from '@/components/experience/timeline';
import { Container } from '@/components/ui/container';
import { DashedDivider } from '@/components/ui/dashed-divider';
import {
  awards,
  education,
  experience,
  skills,
  sortSkillGroups,
  type SkillCategory,
} from '@/data/experience';
import { routing } from '@/i18n/routing';
import { hreflangAlternates, ogImagePath } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'experience' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  // Rota (não post) -> existe em todos os locales -> hreflang completo (lib/seo).
  const ogTitle = tNav('experience');

  return {
    title: t('metaTitle'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/experience`,
      languages: hreflangAlternates((l) => `/${l}/experience`),
    },
    openGraph: {
      type: 'website',
      url: `/${locale}/experience`,
      images: [{ url: ogImagePath(ogTitle), width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const presentLabel = t('experience.present');

  // DADOS (data/experience.ts) -> TimelineEntry, escolhendo o idioma do locale.
  // Datas/empresa/instituição/stack são locale-neutral; role/degree/description variam.
  const experienceEntries: TimelineEntry[] = experience.map((item) => ({
    start: item.start,
    end: item.end,
    title: item.role[locale],
    subtitle: item.company,
    description: item.description[locale],
    tags: item.stack,
  }));

  const educationEntries: TimelineEntry[] = education.map((item) => ({
    start: item.start,
    end: item.end,
    title: item.degree[locale],
    subtitle: item.institution,
    description: item.description?.[locale],
  }));

  const awardEntries: AwardEntry[] = awards.map((item) => ({
    year: item.year,
    event: item.event,
    result: item.result[locale],
  }));

  const skillGroups = sortSkillGroups(skills);
  const categoryLabels: Record<SkillCategory, string> = {
    frameworks: t('experience.categories.frameworks'),
    languages: t('experience.categories.languages'),
    tools: t('experience.categories.tools'),
    'ai-ml': t('experience.categories.ai-ml'),
    infra: t('experience.categories.infra'),
  };

  // Seções data-driven: cada uma só entra com conteúdo. Enquanto data/experience.ts
  // não é populado (MAI-506), a página rende só o header. DashedDivider entre as presentes.
  const sections: { key: string; node: ReactNode }[] = [];

  if (experienceEntries.length > 0) {
    sections.push({
      key: 'work',
      node: (
        <Section id="experience-work" heading={t('experience.sections.experience')}>
          <Timeline entries={experienceEntries} presentLabel={presentLabel} />
        </Section>
      ),
    });
  }

  if (awardEntries.length > 0) {
    sections.push({
      key: 'awards',
      node: (
        <Section id="experience-awards" heading={t('experience.sections.awards')}>
          <Awards entries={awardEntries} />
        </Section>
      ),
    });
  }

  if (educationEntries.length > 0) {
    sections.push({
      key: 'education',
      node: (
        <Section id="experience-education" heading={t('experience.sections.education')}>
          <Timeline entries={educationEntries} presentLabel={presentLabel} />
        </Section>
      ),
    });
  }

  if (skillGroups.length > 0) {
    sections.push({
      key: 'skills',
      node: (
        <Section id="experience-skills" heading={t('experience.sections.skills')}>
          <div className="flex flex-col gap-6">
            {skillGroups.map((group) => (
              <SkillGroup
                key={group.category}
                label={categoryLabels[group.category]}
                skills={group.skills}
              />
            ))}
          </div>
        </Section>
      ),
    });
  }

  return (
    <Container size="sm" className="flex flex-col py-20 sm:py-28">
      <header className="flex flex-col gap-4">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t('nav.experience')}
        </h1>
        <p className="text-muted-foreground text-lg text-pretty">{t('experience.lead')}</p>
      </header>

      {sections.map(({ key, node }) => (
        <Fragment key={key}>
          <DashedDivider className="my-12" />
          {node}
        </Fragment>
      ))}
    </Container>
  );
}

// Seção da página: kicker mono ▸ + conteúdo, espelhando o padrão da About.
function Section({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <h2 id={id} className="text-muted-foreground font-mono text-sm font-medium tracking-[0.12em]">
        <span aria-hidden>▸ </span>
        {heading}
      </h2>
      {children}
    </section>
  );
}

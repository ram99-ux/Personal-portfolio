import { siteConfig } from '@/config/site';
import { education, experience, projects, skillGroups } from '@/constants/content';

export function StructuredData() {
  const skills = skillGroups.flatMap((g) => g.items);

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    email: `mailto:${siteConfig.email}`,
    telephone: siteConfig.phone,
    url: siteConfig.url,
    description: siteConfig.description,
    knowsAbout: skills,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    worksFor: {
      '@type': 'Organization',
      name: experience[0]?.company ?? 'Push Digital',
    },
    alumniOf: education.map((item) => ({
      '@type': 'EducationalOrganization',
      name: item.institution,
    })),
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Full Stack Developer',
      occupationalCategory: '15-1254.00',
      skills: skills.join(', '),
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${siteConfig.name} — ${siteConfig.role}`,
    url: siteConfig.url,
    inLanguage: 'en',
    author: { '@type': 'Person', name: siteConfig.name },
  };

  const portfolio = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Selected work',
    url: `${siteConfig.url}#work`,
    hasPart: projects.map((project) => ({
      '@type': 'CreativeWork',
      name: project.title,
      description: project.summary,
      dateCreated: project.year,
      keywords: project.stack.join(', '),
      author: { '@type': 'Person', name: siteConfig.name },
    })),
  };

  return (
    <>
      {[person, website, portfolio].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Static, author-controlled objects — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

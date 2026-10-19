/**
 * Service pages at /services/<slug>. Names and slugs are used site-wide
 * (footer, case studies, journal posts); page copy lives alongside.
 */

export type ServiceSummary = {
  slug: string;
  /** Short name for links and the footer */
  name: string;
};

export const SERVICE_PAGES: ServiceSummary[] = [
  { slug: 'web-design', name: 'Web design for startups' },
  { slug: 'branding', name: 'Startup branding' },
  { slug: 'saas-website-design', name: 'SaaS website design' },
  { slug: 'webflow-nextjs-development', name: 'Webflow & Next.js development' },
  { slug: 'website-redesign', name: 'Website redesign' },
];

export const serviceBySlug = (slug: string) => SERVICE_PAGES.find((s) => s.slug === slug);
export const servicePath = (slug: string) => `/services/${slug}`;

/** The service page each case study links to, based on the work listed for it */
export const SERVICE_FOR_CASE: Record<string, string> = {
  unita: 'saas-website-design',
  folionomics: 'saas-website-design',
  breakthirty: 'web-design',
  'beyond-hut': 'web-design',
  cayano: 'web-design',
};

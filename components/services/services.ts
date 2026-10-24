/**
 * Service pages at /services and /services/<slug>: names, slugs and meta used
 * site-wide (footer, case studies, journal posts, pre-renderer). Page copy is in content.ts.
 */

export type ServiceSummary = {
  slug: string;
  /** Short name for links and the footer */
  name: string;
  /** <title>, under 60 characters */
  title: string;
  /** Meta description, under 155 characters */
  description: string;
  /** One line for the hub card */
  teaser: string;
};

export const SERVICE_PAGES: ServiceSummary[] = [
  {
    slug: 'web-design',
    name: 'Web design for startups',
    title: 'Web Design Agency for Startups | Natwic',
    description: 'Startup website design that turns visitors into users. Natwic plans, designs and builds launch-ready sites for founders anywhere, working remotely.',
    teaser: 'Launch-ready marketing sites that explain what you do in seconds and give visitors a clear next step.',
  },
  {
    slug: 'branding',
    name: 'Startup branding',
    title: 'Startup Branding Agency & Brand Identity Design | Natwic',
    description: 'Brand identity design for startups: logo, type, color and a system your team can use. A startup branding agency working remotely with founders.',
    teaser: 'A logo, type, color and a simple system that makes a young company look as good as the thing it sells.',
  },
  {
    slug: 'saas-website-design',
    name: 'SaaS website design',
    title: 'SaaS Website Design Agency | Natwic',
    description: 'A SaaS website design agency for early-stage teams. We design marketing sites that explain your product, show it working and turn visitors into trials.',
    teaser: 'Marketing sites for software products that explain the value fast, show the product working and drive sign-ups.',
  },
  {
    slug: 'webflow-nextjs-development',
    name: 'Webflow & Next.js development',
    title: 'Webflow Development Agency & Next.js Websites | Natwic',
    description: 'Webflow development and Next.js website development for startups. Fast, editable sites built from your designs or ours, by a remote team.',
    teaser: 'Fast, editable websites built in Webflow or Next.js, from your designs or ours.',
  },
  {
    slug: 'website-redesign',
    name: 'Website redesign',
    title: 'Website Redesign Services | Natwic',
    description: 'Website redesign services for startups and small businesses. We rebuild outdated sites around your current product, with a clear plan to protect SEO.',
    teaser: 'A rebuilt site that matches where your company is today, without losing the search traffic you already have.',
  },
  {
    slug: 'social-media',
    name: 'Social media management',
    title: 'Social Media Management Services | Natwic',
    description: 'Social media management services for startups and small businesses: strategy, on-brand content and steady posting, handled by one remote team.',
    teaser: 'On-brand posts, a clear plan and steady publishing, so your social channels look as good as your product.',
  },
];

export const serviceBySlug = (slug: string) => SERVICE_PAGES.find((s) => s.slug === slug);
export const servicePath = (slug: string) => `/services/${slug}`;

/** The service page each case study links to, based on the work listed for it */
export const SERVICE_FOR_CASE: Record<string, string> = {
  unita: 'saas-website-design',
  juno: 'saas-website-design',
  breakthirty: 'web-design',
  'beyond-hut': 'web-design',
  cayano: 'web-design',
};

/** Meta for the /services hub */
export const SERVICES_HUB = {
  title: 'Web Design and Branding Services | Natwic',
  description: 'Web design and branding services for startups, SaaS teams and small businesses worldwide: websites, brand identity, redesigns, development, social media.',
};

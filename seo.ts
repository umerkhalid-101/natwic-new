/** Page titles and descriptions, shared by the app and the build-time pre-renderer. */

import { PROJECTS, projectBySlug } from './components/work/projects';
import { SERVICE_PAGES, SERVICES_HUB, serviceBySlug } from './components/services/services';

export const BASE_URL = 'https://www.natwic.com';

export type View = 'home' | 'contact' | 'studio' | 'privacy' | 'terms' | 'work' | 'journal' | 'services';

export const VIEWS: View[] = ['home', 'studio', 'work', 'services', 'journal', 'contact', 'privacy', 'terms'];

export const ROUTE_META: Record<View, { title: string; description: string }> = {
  home: {
    title: 'Web Design & Branding Studio for Startups | Natwic',
    description:
      'Natwic is a web design and branding studio for startups, SaaS teams and small businesses worldwide. Based in Dubai, working with clients everywhere.',
  },
  studio: {
    title: 'About Natwic: A Remote Web Design & Branding Team',
    description:
      'Meet the team behind Natwic: designers, developers and strategists working remotely with startups, SaaS teams and small businesses around the world.',
  },
  work: {
    title: 'Web Design & Branding Case Studies | Natwic',
    description:
      'Case studies of websites, brands and products Natwic designed and built for startups, SaaS teams and small businesses: the brief, the approach, the result.',
  },
  services: { title: SERVICES_HUB.title, description: SERVICES_HUB.description },
  journal: {
    title: 'Web Design & Branding Guides for Startups | Natwic',
    description:
      'Practical guides from the Natwic studio on web design, branding, website costs and launching products for startups, SaaS teams and small businesses.',
  },
  contact: {
    title: 'Start a Web Design or Branding Project | Natwic',
    description:
      'Tell us what you’re building. Natwic designs websites, brands and content for startups and small businesses worldwide, and replies within 24 hours.',
  },
  privacy: {
    title: 'Privacy Policy | Natwic',
    description: 'What personal information Natwic collects through this website and its forms, how we use it, and how to contact us about your data.',
  },
  terms: {
    title: 'Terms of Service | Natwic',
    description: 'The terms for using the Natwic website, including intellectual property rights, user representations and the governing law.',
  },
};

export const urlFor = (view: View) => (view === 'home' ? `${BASE_URL}/` : `${BASE_URL}/${view}`);

// Journal posts are only known to the journal chunk; unknown slugs 404 on the server
const journalSlug = (pathname: string) => pathname.match(/^\/journal\/([^/]+)\/?$/)?.[1] ?? null;

const serviceSlug = (pathname: string) => {
  const s = pathname.match(/^\/services\/([^/]+)\/?$/)?.[1];
  return s && serviceBySlug(s) ? s : null;
};

export const slugFromPath = (pathname: string): string | null => {
  const m = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (m) return projectBySlug(m[1]) ? m[1] : null;
  return serviceSlug(pathname) ?? journalSlug(pathname);
};

export const viewFromPath = (pathname: string): View => {
  if (journalSlug(pathname)) return 'journal';
  if (serviceSlug(pathname)) return 'services';
  if (slugFromPath(pathname)) return 'work';
  const path = pathname.replace(/^\//, '').replace(/\/$/, '') as View;
  return VIEWS.includes(path) && path !== 'home' ? path : 'home';
};

/** Case studies at /work/<slug> */
export const CASE_SLUGS = PROJECTS.map((p) => p.slug);
export const caseMeta = (slug: string) => {
  const p = projectBySlug(slug) ?? PROJECTS[0];
  return {
    title: p.seoTitle ?? `${p.title} Case Study: ${p.industry} | Natwic`,
    description: p.seoDescription ?? `${p.summary} How Natwic handled ${p.services.join(', ').toLowerCase()} for ${p.domain}, working remotely.`,
    image: p.ogImage ? `${BASE_URL}${p.ogImage}` : undefined,
    /** Above-the-fold image worth preloading (Juno's hero shot) */
    preload: p.slug === 'juno' ? '/work/juno/juno-homepage-hero.webp' : `/work/${p.slug}/${p.slug}-hero.webp`,
  };
};
export const caseUrl = (slug: string) => `${BASE_URL}/work/${slug}`;
export const postUrl = (slug: string) => `${BASE_URL}/journal/${slug}`;

/** Service pages at /services/<slug> */
export const SERVICE_SLUGS = SERVICE_PAGES.map((s) => s.slug);
export const serviceMeta = (slug: string) => {
  const s = serviceBySlug(slug) ?? SERVICE_PAGES[0];
  return { title: s.title, description: s.description };
};
export const serviceUrl = (slug: string) => `${BASE_URL}/services/${slug}`;

/** Page titles and descriptions, shared by the app and the build-time pre-renderer. */

import { PROJECTS, projectBySlug } from './components/work/projects';
import { SERVICE_PAGES, SERVICES_HUB, serviceBySlug } from './components/services/services';

export const BASE_URL = 'https://www.natwic.com';

export type View = 'home' | 'contact' | 'studio' | 'privacy' | 'terms' | 'work' | 'journal' | 'services';

export const VIEWS: View[] = ['home', 'studio', 'work', 'services', 'journal', 'contact', 'privacy', 'terms'];

export const ROUTE_META: Record<View, { title: string; description: string }> = {
  home: {
    title: 'Natwic | Web Design & Branding Studio for Startups and Small Businesses',
    description:
      'Natwic is a web design and branding studio for startups, SaaS teams and small businesses worldwide. Based in Dubai, working remotely with clients everywhere.',
  },
  studio: {
    title: 'Our Studio | Natwic',
    description:
      'Meet the team behind Natwic: designers, developers and strategists working with startups and small businesses around the world.',
  },
  work: {
    title: 'Selected Work | Natwic',
    description: 'Websites, brands and products Natwic has designed for startups, SaaS teams and small businesses.',
  },
  services: { title: SERVICES_HUB.title, description: SERVICES_HUB.description },
  journal: {
    title: 'Journal | Natwic',
    description: 'Notes from the Natwic studio on web design, branding and building products for startups and small businesses.',
  },
  contact: {
    title: 'Start a Project | Natwic',
    description:
      'Tell us what you’re building. Natwic designs websites, brands and content for startups and small businesses, wherever you are.',
  },
  privacy: { title: 'Privacy Policy | Natwic', description: 'Natwic Studio privacy policy.' },
  terms: { title: 'Terms of Service | Natwic', description: 'Natwic Studio terms of service.' },
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

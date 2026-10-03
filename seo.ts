/** Page titles and descriptions, shared by the app and the build-time pre-renderer. */

import { PROJECTS, projectBySlug } from './components/work/projects';

export const BASE_URL = 'https://www.natwic.com';

export type View = 'home' | 'contact' | 'studio' | 'privacy' | 'terms' | 'work';

export const VIEWS: View[] = ['home', 'studio', 'work', 'contact', 'privacy', 'terms'];

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
  contact: {
    title: 'Start a Project | Natwic',
    description:
      'Tell us what you’re building. Natwic designs websites, brands and content for startups and small businesses, wherever you are.',
  },
  privacy: { title: 'Privacy Policy | Natwic', description: 'Natwic Studio privacy policy.' },
  terms: { title: 'Terms of Service | Natwic', description: 'Natwic Studio terms of service.' },
};

export const urlFor = (view: View) => (view === 'home' ? `${BASE_URL}/` : `${BASE_URL}/${view}`);

export const slugFromPath = (pathname: string): string | null => {
  const m = pathname.match(/^\/work\/([^/]+)\/?$/);
  return m && projectBySlug(m[1]) ? m[1] : null;
};

export const viewFromPath = (pathname: string): View => {
  if (slugFromPath(pathname)) return 'work';
  const path = pathname.replace(/^\//, '').replace(/\/$/, '') as View;
  return VIEWS.includes(path) && path !== 'home' ? path : 'home';
};

/** Case studies at /work/<slug> */
export const CASE_SLUGS = PROJECTS.map((p) => p.slug);
export const caseMeta = (slug: string) => {
  const p = projectBySlug(slug) ?? PROJECTS[0];
  return {
    title: `${p.title}: ${p.category} case study | Natwic`,
    description: `${p.summary} How Natwic designed and built ${p.domain}.`,
  };
};
export const caseUrl = (slug: string) => `${BASE_URL}/work/${slug}`;

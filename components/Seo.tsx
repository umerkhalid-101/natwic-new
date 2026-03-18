import React, { useEffect } from 'react';

const BASE_URL = 'https://www.natwic.com';
const DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/d/1TNWPq9K4wbLxAey0l4zm8fNPya-DOx62';

interface SeoProps {
  title: string;
  description: string;
  view?: string;
  image?: string;
}

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [attrName, attrValue] = selector.match(/\[([^=]+)="([^"]+)"\]/)?.slice(1) ?? [];
    if (attrName) el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

export const Seo: React.FC<SeoProps> = ({ title, description, view, image = DEFAULT_IMAGE }) => {
  useEffect(() => {
    const url = view && view !== 'home'
      ? `${BASE_URL}/?view=${view}`
      : `${BASE_URL}/`;

    // Title
    document.title = title;

    // Description
    setMeta('meta[name="description"]', 'content', description);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:image"]', 'content', image);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:url"]', 'content', url);
    setMeta('meta[name="twitter:image"]', 'content', image);

  }, [title, description, view, image]);

  return null;
};

import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  view?: string;
}

export const Seo: React.FC<SeoProps> = ({ title, description, view }) => {
  useEffect(() => {
    // Update Title
    document.title = title;
    
    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update Canonical URL and OG URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');

    const url = new URL(window.location.origin);
    if (view && view !== 'home') {
      url.searchParams.set('view', view);
    }
    const finalUrl = url.toString();

    linkCanonical.setAttribute('href', finalUrl);
    if (ogUrl) ogUrl.setAttribute('content', finalUrl);

  }, [title, description, view]);

  return null;
};
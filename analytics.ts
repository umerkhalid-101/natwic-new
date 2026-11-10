/** GA4 events. gtag is loaded in index.html; these are no-ops when it's blocked or missing. */

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export const track = (event: string, params: Record<string, unknown> = {}) => {
  try { window.gtag?.('event', event, params); } catch { /* analytics must never break the page */ }
};

/** A brief was sent successfully from one of the site's forms */
export const trackLead = (form: string, service?: string) =>
  track('generate_lead', { form_location: form, page_path: window.location.pathname, ...(service ? { service } : {}) });

/** Email, phone and booking links anywhere on the site, caught with one listener */
export const trackContactLinks = () => {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="mailto:"], a[href^="tel:"], a[href*="calendly.com/"]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute('href') ?? '';
    const params = { link_url: href, page_path: window.location.pathname };
    track(href.startsWith('mailto:') ? 'email_click' : href.startsWith('tel:') ? 'phone_click' : 'booking_click', params);
  }, { capture: true });
};

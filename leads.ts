import type { Brief } from './components/QuickBrief';

/** Every form sends its brief to /api/lead (api/lead.ts), which saves it and alerts the team. */

const VISIT_KEY = 'natwic:visit';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

type Visit = { landing_page: string; referrer: string } & Partial<Record<(typeof UTM_KEYS)[number], string>>;

/**
 * Remembers how this visit started (first page, referrer, UTM tags) so a lead sent
 * five pages later still says where it came from. Call once on page load.
 * Only full page loads count; links inside the site don't reload, so they never overwrite it.
 */
export const rememberVisit = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    // Keep the first page of the visit, unless this page came from a tagged campaign link
    if (sessionStorage.getItem(VISIT_KEY) && !UTM_KEYS.some((k) => params.has(k))) return;
    // Only other sites count as a referrer; a reload or our own page isn't one
    const ref = document.referrer;
    const external = ref && (() => { try { return new URL(ref).origin !== window.location.origin; } catch { return false; } })();
    const visit: Visit = { landing_page: window.location.pathname, referrer: external ? ref : '' };
    for (const k of UTM_KEYS) { const v = params.get(k); if (v) visit[k] = v; }
    sessionStorage.setItem(VISIT_KEY, JSON.stringify(visit));
  } catch { /* storage blocked: the lead just goes without visit details */ }
};

const readVisit = (): Partial<Visit> => {
  try { return JSON.parse(sessionStorage.getItem(VISIT_KEY) ?? '{}'); } catch { return {}; }
};

/** `sendLead('Services')` gives the `send` a QuickBrief needs; it throws when the lead wasn't saved. */
export const sendLead = (source: string) => async (b: Brief) => {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: b.name,
      email: b.email,
      service: b.services.join(', ') || 'Not specified',
      message: b.message,
      source,
      page: window.location.pathname,
      trap: b.trap ?? '',
      elapsed_ms: b.elapsedMs,
      ...readVisit(),
    }),
  });
  if (!res.ok) throw new Error(`Lead not saved (${res.status})`);
};

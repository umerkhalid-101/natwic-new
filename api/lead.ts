/**
 * POST /api/lead: every form on the site sends its brief here (Vercel serverless function).
 *
 * The lead is saved to the Google Sheet and, if configured, sent to email and Slack.
 * It answers 200 only when at least one of those actually worked, so the form can
 * show a real error instead of a fake "Thanks".
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   LEAD_SHEET_URL     Apps Script web app URL (see scripts/lead-sheet.gs). Defaults to the home page sheet.
 *   RESEND_API_KEY     Resend API key, for an email per lead
 *   LEAD_NOTIFY_EMAIL  Where that email goes, e.g. hello@natwic.com (comma-separate for several)
 *   LEAD_FROM_EMAIL    Sender; needs a domain verified in Resend. Defaults to Resend's test sender.
 *   SLACK_WEBHOOK_URL  Slack incoming webhook, for a message per lead
 *   TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret, checking the form's "hold to verify" token.
 *                      Set it together with VITE_TURNSTILE_SITE_KEY (components/HumanCheck.tsx):
 *                      a secret without the site key marks every lead as spam.
 */

const DEFAULT_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbwqQ2130Za78V8VFQ2p-1Le5mvGsly5B6wwfJjPLM1n8KPboQBU02a3fHCeGYaCOQIs/exec';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Faster than any person can fill the form in: almost certainly a bot
const MIN_FILL_MS = 2500;

type Lead = {
  submitted_at: string;
  name: string;
  email: string;
  service: string;
  message: string;
  source: string;
  page: string;
  landing_page: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  country: string;
  city: string;
  user_agent: string;
  spam: string;
};

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const withTimeout = (ms: number) => AbortSignal.timeout(ms);

/**
 * Asks Cloudflare whether the form's Turnstile token is real. With no secret set the check
 * is off. If Cloudflare can't be reached the lead passes: an outage must not cost a lead.
 */
const verifyHuman = async (token: string, ip: string) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
      signal: withTimeout(5_000),
    });
    const out = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!out.success) console.warn('[lead] turnstile rejected:', out['error-codes']);
    return Boolean(out.success);
  } catch (e) {
    console.error('[lead] turnstile unreachable, letting the lead through:', e);
    return true;
  }
};

/** Apps Script runs the script, then redirects to its output; fetch follows that redirect. */
const saveToSheet = async (lead: Lead) => {
  const url = process.env.LEAD_SHEET_URL || DEFAULT_SHEET_URL;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(lead),
    redirect: 'follow',
    signal: withTimeout(10_000),
  });
  const body = await res.text();
  // A script without access returns Google's HTML sign-in or "Access Denied" page with status 200 or 403
  if (!res.ok || /<html/i.test(body)) throw new Error(`sheet responded ${res.status}: ${body.slice(0, 120)}`);
};

const sendEmail = async (lead: Lead) => {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return 'skipped' as const;
  const rows: [string, string][] = [
    ['Name', lead.name], ['Email', lead.email], ['Service', lead.service], ['Form', lead.source],
    ['Page', lead.page], ['First landed on', lead.landing_page], ['Referrer', lead.referrer],
    ['UTM', [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ')],
    ['Location', [lead.city, lead.country].filter(Boolean).join(', ')],
  ];
  const html = `
    <p style="font:16px/1.5 sans-serif;white-space:pre-wrap">${escapeHtml(lead.message)}</p>
    <table style="font:14px/1.5 sans-serif;border-collapse:collapse">
      ${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#666">${k}</td><td>${escapeHtml(v)}</td></tr>`).join('')}
    </table>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || 'Natwic leads <onboarding@resend.dev>',
      to: to.split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: lead.email,
      subject: `New lead: ${lead.name} (${lead.service || lead.source})`,
      html,
    }),
    signal: withTimeout(10_000),
  });
  if (!res.ok) throw new Error(`resend responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return 'sent' as const;
};

const sendSlack = async (lead: Lead) => {
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (!hook) return 'skipped' as const;
  const where = [lead.city, lead.country].filter(Boolean).join(', ');
  const res = await fetch(hook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `New lead from ${lead.name} <mailto:${lead.email}|${lead.email}>`,
      blocks: [
        { type: 'section', text: { type: 'mrkdwn', text: `*New lead:* ${lead.name} · <mailto:${lead.email}|${lead.email}>\n*Service:* ${lead.service || 'Not specified'} · *Form:* ${lead.source}${where ? ` · ${where}` : ''}` } },
        { type: 'section', text: { type: 'plain_text', text: lead.message.slice(0, 2900) || '(no message)' } },
        { type: 'context', elements: [{ type: 'mrkdwn', text: `Page ${lead.page || '?'} · landed on ${lead.landing_page || '?'} · ref ${lead.referrer || 'direct'}${lead.utm_source ? ` · utm ${lead.utm_source}/${lead.utm_medium}/${lead.utm_campaign}` : ''}` }] },
      ],
    }),
    signal: withTimeout(10_000),
  });
  if (!res.ok) throw new Error(`slack responded ${res.status}`);
  return 'sent' as const;
};

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const name = text(body.name, 200);
  const email = text(body.email, 320);
  const message = text(body.message, 5000);
  if (!name || !EMAIL_RE.test(email)) return json({ ok: false, error: 'invalid_fields' }, 400);

  // Bots fill the hidden field, submit instantly or fail the Turnstile check. Real people who
  // trip this are still saved to the sheet (marked spam), just without an alert, so no lead is ever thrown away.
  const h = request.headers;
  const elapsed = typeof body.elapsed_ms === 'number' ? body.elapsed_ms : Infinity;
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim();
  const human = await verifyHuman(text(body.captcha, 2048), ip);
  const spam = Boolean(text(body.trap, 500)) || elapsed < MIN_FILL_MS || !human;

  const lead: Lead = {
    submitted_at: new Date().toISOString(),
    name,
    email,
    service: text(body.service, 200),
    message,
    source: text(body.source, 200) || 'Unknown form',
    page: text(body.page, 500),
    landing_page: text(body.landing_page, 500),
    referrer: text(body.referrer, 500),
    utm_source: text(body.utm_source, 200),
    utm_medium: text(body.utm_medium, 200),
    utm_campaign: text(body.utm_campaign, 200),
    utm_term: text(body.utm_term, 200),
    utm_content: text(body.utm_content, 200),
    country: h.get('x-vercel-ip-country') ?? '',
    city: (() => { try { return decodeURIComponent(h.get('x-vercel-ip-city') ?? ''); } catch { return ''; } })(),
    user_agent: (h.get('user-agent') ?? '').slice(0, 300),
    spam: spam ? 'yes' : '',
  };

  const [sheet, mail, slack] = await Promise.allSettled([
    saveToSheet(lead),
    spam ? Promise.resolve('skipped' as const) : sendEmail(lead),
    spam ? Promise.resolve('skipped' as const) : sendSlack(lead),
  ]);

  for (const [label, r] of [['sheet', sheet], ['email', mail], ['slack', slack]] as const) {
    if (r.status === 'rejected') console.error(`[lead] ${label} failed:`, r.reason);
  }

  const stored = sheet.status === 'fulfilled' || (mail.status === 'fulfilled' && mail.value === 'sent') || (slack.status === 'fulfilled' && slack.value === 'sent');
  if (!stored) {
    // Last resort: the lead is at least in the Vercel function logs
    console.error('[lead] NOT DELIVERED ANYWHERE:', JSON.stringify(lead));
    return json({ ok: false, error: 'not_delivered' }, 502);
  }
  return json({ ok: true });
}

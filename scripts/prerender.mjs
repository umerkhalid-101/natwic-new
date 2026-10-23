// Writes a static HTML file per page so crawlers, AI search and link previews
// get real content and the right title/description without running JavaScript.
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const serverEntry = pathToFileURL(path.resolve('dist-server/entry-server.js')).href;

const { render, ROUTE_META, VIEWS, urlFor, CASE_SLUGS, caseMeta, caseUrl, SERVICE_SLUGS, serviceMeta, serviceUrl, postUrl, POSTS, postMeta, BASE_URL } = await import(serverEntry);

// One clock for every page, shared with the browser so time-based UI hydrates cleanly
globalThis.__NOW__ = Date.now();
const template = (await readFile(path.join(dist, 'index.html'), 'utf8'))
  .replace('</head>', `<script>window.__NOW__=${globalThis.__NOW__}</script>\n</head>`);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Entrance animations render their start state (faded out, slid down) into the HTML, which hides
// headlines from anyone without JavaScript and delays the largest paint. Drop those start states
// here; the app still plays the animations once it loads. Deliberately hidden UI is left alone.
const showEntrances = (html) =>
  html.replace(/<[a-z][^>]* style="([^"]*)"[^>]*>/g, (tag, css) => {
    // Deliberately hidden UI (menus, overlays, hover previews) keeps its styles
    if (/visibility:\s*hidden|pointer-events:\s*none/.test(css) || /aria-hidden="true"/.test(tag)) return tag;
    const decl = css.split(';').filter(Boolean);
    const isFaded = (d) => /^opacity:\s*0$/.test(d.trim());
    const slide = decl.find((d) => /^transform:\s*(translate[XY]?\([^)]*\)|scale\([^)]*\))$/.test(d.trim()));
    const masked = decl.find((d) => /^transform:\s*translateY\((4[5-9]|[5-9]\d|1\d\d)%\)$/.test(d.trim()));
    const keep = decl.filter((d) => !isFaded(d) && d !== masked && !(d === slide && decl.some(isFaded)));
    if (keep.length === decl.length) return tag;
    return tag.replace(` style="${css}"`, keep.length ? ` style="${keep.join(';')}"` : '');
  });

// `preload`: the page's own above-the-fold image. Only the home page keeps the hero texture preload.
const page = (title, description, url, body, image, preload) =>
  (image ? template.replace(/(<meta (?:name|property)="(?:og:image|twitter:image)" content=")[^"]*"/g, `$1${image}"`) : template)
    .replace(/<link rel="preload" as="image"[^>]*>/, (tag) => (url === `${BASE_URL}/` ? tag : preload ? `<link rel="preload" as="image" href="${preload}" imagesrcset="${preload} 1600w, ${preload.replace('.webp', '@2x.webp')} 3200w" imagesizes="(min-width: 1024px) 64rem, 100vw" type="image/webp" fetchpriority="high" />` : ''))
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:title|og:title|twitter:title)" content=")[^"]*"/g, `$1${esc(title)}"`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*"/g, `$1${esc(description)}"`)
    .replace(/(<meta (?:name|property)="(?:og:url|twitter:url)" content=")[^"]*"/g, `$1${url}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
    .replace('<div id="root"></div>', `<div id="root">${showEntrances(body)}</div>`);

for (const view of VIEWS) {
  const { title, description } = ROUTE_META[view];
  const body = await render(view);
  const file = view === 'home' ? 'index.html' : `${view}.html`;
  await writeFile(path.join(dist, file), page(title, description, urlFor(view), body));
  console.log(`prerendered /${view === 'home' ? '' : view} → dist/${file} (${(body.length / 1024).toFixed(0)} KB)`);
}

// One page per case study, at /work/<slug>
await mkdir(path.join(dist, 'work'), { recursive: true });
for (const slug of CASE_SLUGS) {
  const { title, description, image, preload } = caseMeta(slug);
  const body = await render('work', slug);
  await writeFile(path.join(dist, 'work', `${slug}.html`), page(title, description, caseUrl(slug), body, image, preload));
  console.log(`prerendered /work/${slug} → dist/work/${slug}.html (${(body.length / 1024).toFixed(0)} KB)`);
}

// One page per service, at /services/<slug>
await mkdir(path.join(dist, 'services'), { recursive: true });
for (const slug of SERVICE_SLUGS) {
  const { title, description } = serviceMeta(slug);
  const body = await render('services', slug);
  await writeFile(path.join(dist, 'services', `${slug}.html`), page(title, description, serviceUrl(slug), body));
  console.log(`prerendered /services/${slug} → dist/services/${slug}.html (${(body.length / 1024).toFixed(0)} KB)`);
}

// One page per published journal post, at /journal/<slug>
await mkdir(path.join(dist, 'journal'), { recursive: true });
for (const post of POSTS) {
  const { title, description } = postMeta(post);
  const image = post.cover?.startsWith('/') ? `${BASE_URL}${post.cover}` : post.cover;
  const body = await render('journal', post.slug);
  await writeFile(path.join(dist, 'journal', `${post.slug}.html`), page(title, description, postUrl(post.slug), body, image));
  console.log(`prerendered /journal/${post.slug} → dist/journal/${post.slug}.html (${(body.length / 1024).toFixed(0)} KB)`);
}

// A real 404 for unknown URLs: static, not indexed, and without the app script
// (the app would otherwise boot and draw the home page over it)
const notFound = page(
  'Page not found | Natwic',
  'This page does not exist. Head back to the Natwic home page or see our work.',
  `${BASE_URL}/404`,
  `<main class="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
    <p class="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">Error 404</p>
    <h1 class="mt-6 text-5xl md:text-7xl font-bold tracking-[-0.045em] leading-[1.02] text-black">This page doesn’t exist.</h1>
    <p class="mt-6 max-w-md text-lg text-zinc-600 leading-relaxed">The link may be old or mistyped. Here’s where you can go instead.</p>
    <div class="mt-10 flex flex-wrap justify-center gap-3">
      <a href="/" class="rounded-full bg-black text-white px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">Home</a>
      <a href="/work" class="rounded-full border border-zinc-200 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black hover:border-black transition-colors">See our work</a>
      <a href="/services" class="rounded-full border border-zinc-200 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black hover:border-black transition-colors">Services</a>
      <a href="/contact" class="rounded-full border border-zinc-200 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black hover:border-black transition-colors">Contact</a>
    </div>
  </main>`,
)
  .replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex">')
  .replace(/<link rel="canonical"[^>]*>\s*/, '')
  .replace(/<script type="module"[^>]*><\/script>\s*/g, '')
  .replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
  .replace(/<link rel="preload" as="image"[^>]*>\s*/g, '');
await writeFile(path.join(dist, '404.html'), notFound);
console.log('prerendered 404 → dist/404.html (noindex)');

// Sitemap, built from the same routes we just rendered.
// lastmod is the last commit that touched a page's own source, so it only moves
// when that page changes. Unknown dates are left out rather than guessed.
const git = (...args) => {
  try { return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; }
};
// In a shallow clone the oldest commit claims every file, so its date means nothing
const shallowFile = git('rev-parse', '--git-path', 'shallow');
const shallow = new Set(shallowFile && existsSync(shallowFile) ? readFileSync(shallowFile, 'utf8').split('\n').filter(Boolean) : []);
const lastChanged = (...paths) => {
  const [hash, date] = git('log', '-1', '--format=%H %cs', '--', ...paths).split(' ');
  return hash && !shallow.has(hash) ? date : null;
};
const newest = (...dates) => dates.filter(Boolean).sort().pop() ?? null;

const SOURCES = {
  home: ['components/Hero.tsx', 'components/Services.tsx', 'components/WhyUs.tsx', 'components/Stats.tsx', 'components/Partners.tsx', 'components/FAQ.tsx', 'components/Pricing.tsx', 'constants.tsx', 'index.html'],
  studio: ['components/Studio.tsx', 'components/studio'],
  work: ['components/work/WorkPages.tsx', 'components/work/projects.ts'],
  services: ['components/services/ServicePages.tsx', 'components/services/services.ts', 'components/services/content.ts', 'components/services/demos.tsx'],
  journal: ['components/journal/JournalPages.tsx'],
  contact: ['components/Contact.tsx'],
  privacy: ['components/Privacy.tsx'],
  terms: ['components/Terms.tsx'],
};
const latestPost = POSTS.map((p) => p.date).sort().pop();
const viewDate = (v) => (v === 'journal' ? newest(lastChanged(...SOURCES.journal), latestPost) : lastChanged(...(SOURCES[v] ?? [])));
const caseDate = (slug) =>
  slug === 'juno'
    ? lastChanged('components/work/juno', 'public/work/juno')
    : lastChanged('components/work/built', `public/work/${slug}`);
const serviceDate = () => lastChanged('components/services');
const postDate = (p) => newest(p.date, lastChanged(`content/journal/${p.slug}.md`));

const PRIORITY = { home: ['weekly', '1.0'], studio: ['monthly', '0.8'], work: ['monthly', '0.8'], services: ['monthly', '0.9'], journal: ['weekly', '0.8'], contact: ['monthly', '0.7'], privacy: ['yearly', '0.3'], terms: ['yearly', '0.3'] };
const entries = [
  ...VIEWS.map((v) => [urlFor(v), ...(PRIORITY[v] ?? ['monthly', '0.5']), viewDate(v)]),
  ...CASE_SLUGS.map((slug) => [caseUrl(slug), 'monthly', '0.7', caseDate(slug)]),
  ...SERVICE_SLUGS.map((slug) => [serviceUrl(slug), 'monthly', '0.8', serviceDate()]),
  ...POSTS.map((p) => [postUrl(p.slug), 'monthly', '0.6', postDate(p)]),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(([loc, freq, pri, lastmod]) => `  <url>
    <loc>${loc}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
console.log(`wrote dist/sitemap.xml (${entries.length} URLs)`);

await rm(path.resolve('dist-server'), { recursive: true, force: true });

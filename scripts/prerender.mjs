// Writes a static HTML file per page so crawlers, AI search and link previews
// get real content and the right title/description without running JavaScript.
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const dist = path.resolve('dist');
const serverEntry = pathToFileURL(path.resolve('dist-server/entry-server.js')).href;

const { render, ROUTE_META, VIEWS, urlFor, CASE_SLUGS, caseMeta, caseUrl, BASE_URL } = await import(serverEntry);

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const page = (title, description, url, body) =>
  template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:title|og:title|twitter:title)" content=")[^"]*"/g, `$1${esc(title)}"`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*"/g, `$1${esc(description)}"`)
    .replace(/(<meta (?:name|property)="(?:og:url|twitter:url)" content=")[^"]*"/g, `$1${url}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

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
  const { title, description } = caseMeta(slug);
  const body = await render('work', slug);
  await writeFile(path.join(dist, 'work', `${slug}.html`), page(title, description, caseUrl(slug), body));
  console.log(`prerendered /work/${slug} → dist/work/${slug}.html (${(body.length / 1024).toFixed(0)} KB)`);
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

// Sitemap, built from the same routes we just rendered
const today = new Date().toISOString().slice(0, 10);
const PRIORITY = { home: ['weekly', '1.0'], studio: ['monthly', '0.8'], work: ['monthly', '0.8'], contact: ['monthly', '0.7'], privacy: ['yearly', '0.3'], terms: ['yearly', '0.3'] };
const entries = [
  ...VIEWS.map((v) => [urlFor(v), ...(PRIORITY[v] ?? ['monthly', '0.5'])]),
  ...CASE_SLUGS.map((slug) => [caseUrl(slug), 'monthly', '0.7']),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(([loc, freq, pri]) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
console.log(`wrote dist/sitemap.xml (${entries.length} URLs)`);

await rm(path.resolve('dist-server'), { recursive: true, force: true });

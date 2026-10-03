// Writes a static HTML file per page so crawlers, AI search and link previews
// get real content and the right title/description without running JavaScript.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const dist = path.resolve('dist');
const serverEntry = pathToFileURL(path.resolve('dist-server/entry-server.js')).href;

const { render, ROUTE_META, VIEWS, urlFor } = await import(serverEntry);

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const view of VIEWS) {
  const { title, description } = ROUTE_META[view];
  const url = urlFor(view);
  const body = await render(view);

  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:title|og:title|twitter:title)" content=")[^"]*"/g, `$1${esc(title)}"`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*"/g, `$1${esc(description)}"`)
    .replace(/(<meta (?:name|property)="(?:og:url|twitter:url)" content=")[^"]*"/g, `$1${url}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const file = view === 'home' ? 'index.html' : `${view}.html`;
  await writeFile(path.join(dist, file), html);
  console.log(`prerendered /${view === 'home' ? '' : view} → dist/${file} (${(body.length / 1024).toFixed(0)} KB)`);
}

await rm(path.resolve('dist-server'), { recursive: true, force: true });

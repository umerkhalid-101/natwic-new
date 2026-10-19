import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const JOURNAL_DIR = path.resolve('content/journal');
const INDEX_ID = 'virtual:journal-index';
const SIZES_ID = 'virtual:image-sizes';
const PUBLIC_DIR = path.resolve('public');

/**
 * Exposes just the slug, title and date of each journal post, newest first,
 * so the site-wide footer can link to them without bundling every post.
 */
const journalIndex = (): Plugin => {
  let dev = false;
  return {
    name: 'journal-index',
    configResolved(c) { dev = c.command === 'serve'; },
    resolveId: (id) => (id === INDEX_ID ? `\0${INDEX_ID}` : null),
    load(id) {
      if (id !== `\0${INDEX_ID}`) return null;
      const posts = readdirSync(JOURNAL_DIR)
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
          this.addWatchFile(path.join(JOURNAL_DIR, f));
          const fm = readFileSync(path.join(JOURNAL_DIR, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
          const data = (fm ? parse(fm[1]) : {}) ?? {};
          const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '').slice(0, 10);
          return { slug: f.replace(/\.md$/, ''), title: String(data.title ?? f), date, draft: Boolean(data.draft) };
        })
        // Drafts only show up in `npm run dev`, same as the journal itself
        .filter((p) => dev || !p.draft)
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(({ draft, ...p }) => p);
      return `export default ${JSON.stringify(posts)};`;
    },
  };
};

/** Width and height from a WebP, PNG or JPEG header, or null for anything else */
const imageSize = (b: Buffer): { width: number; height: number } | null => {
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    return null;
  }
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return null;
};

/**
 * Sizes of the images uploaded through the CMS (public/journal), keyed by
 * public path, so Markdown images can reserve their space before loading.
 */
const imageSizes = (): Plugin => ({
  name: 'image-sizes',
  resolveId: (id) => (id === SIZES_ID ? `\0${SIZES_ID}` : null),
  load(id) {
    if (id !== `\0${SIZES_ID}`) return null;
    const dir = path.join(PUBLIC_DIR, 'journal');
    this.addWatchFile(dir);
    const sizes: Record<string, [number, number]> = {};
    for (const f of existsSync(dir) ? readdirSync(dir) : []) {
      const size = /\.(webp|png|jpe?g)$/i.test(f) ? imageSize(readFileSync(path.join(dir, f))) : null;
      if (size) sizes[`/journal/${f}`] = [size.width, size.height];
    }
    return `export default ${JSON.stringify(sizes)};`;
  },
});

export default defineConfig({
  plugins: [react(), journalIndex(), imageSizes()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    historyApiFallback: true
  }
});

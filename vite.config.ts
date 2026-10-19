import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const JOURNAL_DIR = path.resolve('content/journal');
const INDEX_ID = 'virtual:journal-index';

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

export default defineConfig({
  plugins: [react(), journalIndex()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    historyApiFallback: true
  }
});

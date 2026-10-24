/** Journal posts: Markdown files in /content/journal, written through the CMS at /admin. */

import { parse } from 'yaml';

export interface Post {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  cover?: string;
  coverAlt: string;
  author?: string;
  tags: string[];
  draft: boolean;
  featured: boolean; // "Pin to front pages" in the CMS
  body: string; // Markdown
  readingMinutes: number;
}

const files = import.meta.glob('../../content/journal/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const isoDate = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '').slice(0, 10);

const toPost = (file: string, raw: string): Post => {
  const slug = file.split('/').pop()!.replace(/\.md$/, '');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const data = (m ? parse(m[1]) : {}) ?? {};
  const body = (m ? m[2] : raw).trim();
  return {
    slug,
    title: data.title ?? slug,
    date: isoDate(data.date),
    excerpt: data.excerpt ?? '',
    cover: data.cover || undefined,
    coverAlt: data.coverAlt ?? '',
    author: data.author || undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    featured: Boolean(data.featured),
    body,
    readingMinutes: Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220)),
  };
};

// Drafts show up in `npm run dev` so you can preview them, never in the live build
export const POSTS: Post[] = Object.entries(files)
  .map(([file, raw]) => toPost(file, raw))
  .filter((p) => import.meta.env.DEV || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

// For the deck on the home, studio and work pages: pinned posts first, then the newest
export const frontPagePosts = (count: number) =>
  [...POSTS.filter((p) => p.featured), ...POSTS.filter((p) => !p.featured)].slice(0, count);

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

// Other posts to read next: the most shared tags first, then the newest
export const relatedPosts = (post: Post, count: number) => {
  const shared = (p: Post) => p.tags.filter((t) => post.tags.includes(t)).length;
  return POSTS.filter((p) => p !== post)
    .map((p, i) => ({ p, score: shared(p), i }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, count)
    .map(({ p }) => p);
};

// Google cuts titles at ~60 characters, so the brand suffix only goes on when it fits
const titleWithBrand = (title: string) =>
  [`${title} | Natwic Journal`, `${title} | Natwic`].find((t) => t.length <= 60) ?? title;

export const postMeta = (p: Post) => ({
  title: titleWithBrand(p.title),
  description: p.excerpt || p.body.replace(/[#>*_`\[\]()!-]/g, '').replace(/\s+/g, ' ').slice(0, 155).trim(),
});

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

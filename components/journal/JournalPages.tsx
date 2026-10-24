import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Marked } from 'marked';
import { POSTS, postBySlug, postMeta, relatedPosts } from './posts';
import { ease, Label, Reveal, spaClick, Meta, Cover, PostCard } from './parts';
import { Seo } from '../Seo';
import { Magnetic } from '../Magnetic';
import { scrollToY } from '../smoothScroll';
import { BASE_URL, postUrl } from '../../seo';
import { Link } from '../nav';
import { SERVICE_PAGES, servicePath } from '../services/services';
import IMAGE_SIZES from 'virtual:image-sizes';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const absolute = (src?: string) => (src && src.startsWith('/') ? `${BASE_URL}${src}` : src);

interface TocItem { id: string; text: string; depth: 2 | 3 }

// Filled while a post renders: the anchors given to its h2/h3 headings
let toc: TocItem[] = [];
let usedIds = new Map<string, number>();

const slugify = (s: string) =>
  s.toLowerCase().replace(/&[a-z]+;|&#\d+;/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-') || 'section';
const plain = (html: string) =>
  html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// Body images load lazily; links that leave the site open in a new tab; headings get anchors
const md = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      const base = slugify(plain(inner));
      const n = usedIds.get(base) ?? 0;
      usedIds.set(base, n + 1);
      const id = n ? `${base}-${n}` : base;
      if (depth === 2 || depth === 3) toc.push({ id, text: plain(inner), depth });
      return `<h${depth} id="${id}">${inner}</h${depth}>`;
    },
    image({ href, title, text }) {
      const caption = title ? `<figcaption>${esc(title)}</figcaption>` : '';
      const size = IMAGE_SIZES[href.split(/[?#]/)[0]];
      const dims = size ? ` width="${size[0]}" height="${size[1]}"` : '';
      return `<figure><img src="${esc(href)}" alt="${esc(text)}"${dims} loading="lazy" decoding="async" />${caption}</figure>`;
    },
    link({ href, title, tokens }) {
      const external = /^https?:\/\//.test(href) && !href.startsWith(BASE_URL);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${attrs}>${this.parser.parseInline(tokens)}</a>`;
    },
  },
});

const renderPost = (body: string) => {
  toc = [];
  usedIds = new Map();
  const html = md.parse(body) as string;
  return { html, toc };
};

const NAV_OFFSET = 110;

const goTo = (id: string) => (e: React.MouseEvent) => {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  scrollToY(el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, 1.1);
  history.replaceState(history.state, '', `#${id}`);
};

// The heading most recently scrolled past
const useActiveHeading = (items: TocItem[]) => {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!items.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - NAV_OFFSET - 40 <= 0) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);
  return active;
};

// Sections, with the subsections of the one being read folded open
const TocList: React.FC<{ items: TocItem[]; active: string | null; onPick?: () => void }> = ({ items, active, onPick }) => {
  // Index of the h2 that a heading sits under
  const owner = (i: number) => items.slice(0, i + 1).map((t) => t.depth).lastIndexOf(2);
  const activeIndex = items.findIndex((t) => t.id === active);
  const activeSection = activeIndex < 0 ? -1 : owner(activeIndex);

  return (
    <ol className="space-y-1">
      {items.map((t, i) => {
        if (t.depth === 3 && owner(i) !== activeSection) return null;
        const on = t.id === active || (t.depth === 2 && i === activeSection);
        return (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={(e) => { goTo(t.id)(e); onPick?.(); }}
              className={`group flex gap-3 py-1.5 leading-snug transition-colors duration-300 ${t.depth === 3 ? 'pl-5 text-[13px]' : 'text-sm font-semibold'} ${on ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
            >
              {t.depth === 2 && (
                <span aria-hidden className={`mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${on ? 'bg-[#703FEC]' : 'bg-zinc-200 group-hover:bg-zinc-400'}`} />
              )}
              <span className={t.id === active && t.depth === 3 ? 'text-[#703FEC]' : ''}>{t.text}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
};

/* ------------------------------------------------------------------ */
/* /journal: the index                                                 */
/* ------------------------------------------------------------------ */

export const JournalIndex: React.FC<{ onOpen: (slug: string) => void }> = ({ onOpen }) => {
  const [lead, ...rest] = POSTS;

  return (
    <div className="bg-white min-h-screen pt-28 md:pt-36 pb-24 md:pb-32">
      <section className="px-5 md:px-12 max-w-7xl mx-auto">
        <h1>
          <span className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500"><span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />Web design &amp; branding guides</span>
          <span className="sr-only">: </span>
          <span className="mt-6 block text-[20vw] md:text-[13vw] font-bold leading-[0.82] tracking-[-0.06em] text-black">
            <Reveal>Journal</Reveal>
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="mt-8 md:mt-10 max-w-xl text-lg md:text-xl text-zinc-600 leading-relaxed"
        >
          What we’re learning about design, brands and building products for startups and small businesses.
        </motion.p>
      </section>

      {!lead && (
        <section className="mt-16 md:mt-24 px-5 md:px-12 max-w-7xl mx-auto border-t border-zinc-200 pt-10">
          <p className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-zinc-400">The first entries are on their way.</p>
        </section>
      )}

      {lead && (
        <section className="mt-16 md:mt-24 px-5 md:px-12 max-w-7xl mx-auto">
          <motion.a
            href={`/journal/${lead.slug}`}
            onClick={spaClick(() => onOpen(lead.slug))}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.4 }}
            className="group grid md:grid-cols-[1.3fr_1fr] gap-6 md:gap-12 items-end"
          >
            <div className="overflow-hidden rounded-[2rem]">
              <Cover post={lead} eager />
            </div>
            <div className="md:pb-4">
              <Meta post={lead} />
              <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02] text-black transition-colors duration-500 group-hover:text-[#703FEC]">
                {lead.title}
              </h2>
              {lead.excerpt && <p className="mt-5 text-lg text-zinc-600 leading-relaxed">{lead.excerpt}</p>}
              <span className="mt-8 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-black">
                Read
                <span className="w-10 h-10 rounded-full border border-zinc-200 grid place-items-center transition-all duration-500 group-hover:bg-[#703FEC] group-hover:border-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
              </span>
            </div>
          </motion.a>
        </section>
      )}

      {rest.length > 0 && (
        <section className="mt-20 md:mt-28 px-5 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 border-t border-zinc-200 pt-14">
          {rest.map((p, i) => <PostCard key={p.slug} post={p} onOpen={onOpen} delay={(i % 3) * 0.08} />)}
        </section>
      )}

      <section className="mt-24 md:mt-32 px-5 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02] max-w-2xl">
          Got something to <span className="italic text-[#703FEC]">build?</span>
        </h2>
        <Magnetic strength={0.3}>
          <Link href="/contact" className="group inline-flex items-center gap-4 rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
            Start a project
            <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
          </Link>
        </Magnetic>
      </section>
    </div>
  );
};

/** Up to three service pages that fit a post, picked from its tags */
const SERVICE_HINTS: [RegExp, string][] = [
  [/saas|software|product/i, 'saas-website-design'],
  [/brand|logo|identity/i, 'branding'],
  [/redesign|rebuild|migrat/i, 'website-redesign'],
  [/social|instagram|linkedin|tiktok/i, 'social-media'],
  [/webflow|next\.?js|develop|cms/i, 'webflow-nextjs-development'],
  [/web|site|design|startup|pricing/i, 'web-design'],
];
const servicesFor = (tags: string[]) => {
  const picked = SERVICE_HINTS.filter(([re]) => tags.some((t) => re.test(t))).map(([, slug]) => slug);
  const slugs = [...new Set([...picked, 'web-design', 'branding', 'website-redesign'])].slice(0, 3);
  return slugs.map((slug) => SERVICE_PAGES.find((sv) => sv.slug === slug)!);
};

/* ------------------------------------------------------------------ */
/* /journal/<slug>: a post                                             */
/* ------------------------------------------------------------------ */

export const JournalPost: React.FC<{ slug: string; onOpen: (slug: string) => void }> = ({ slug, onOpen }) => {
  const post = postBySlug(slug);
  const { html, toc: headings } = useMemo(() => (post ? renderPost(post.body) : { html: '', toc: [] as TocItem[] }), [post]);
  const active = useActiveHeading(headings);
  const [tocOpen, setTocOpen] = useState(false);

  // Arriving on /journal/<slug>#section lands on that section
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (!el) return;
    const t = setTimeout(() => scrollToY(el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, 0.01), 300);
    return () => clearTimeout(t);
  }, [html]);

  if (!post) {
    return (
      <div className="bg-white min-h-screen pt-40 px-5 md:px-12 max-w-3xl mx-auto">
        <Seo title="Post not found | Natwic" description="This journal post does not exist." view={`journal/${slug}`} />
        <Label>Journal</Label>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-[-0.045em] leading-[1.02]">This post doesn’t exist.</h1>
        <Link href="/journal" className="mt-10 inline-block rounded-full bg-black text-white px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">All posts</Link>
      </div>
    );
  }

  const more = relatedPosts(post, 3);
  const services = servicesFor(post.tags);
  const url = postUrl(post.slug);
  const { title, description } = postMeta(post);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      inLanguage: 'en',
      description,
      datePublished: post.date,
      url,
      mainEntityOfPage: url,
      ...(post.cover ? { image: absolute(post.cover) } : {}),
      author: post.author ? { '@type': 'Person', name: post.author } : { '@type': 'Organization', name: 'Natwic' },
      publisher: { '@id': `${BASE_URL}/#organization`, '@type': 'Organization', name: 'Natwic Studio', logo: { '@type': 'ImageObject', url: `${BASE_URL}/brand/icon-512.png` } },
      ...(post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Journal', item: `${BASE_URL}/journal` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];
  const crumb = 'text-zinc-500 hover:text-black transition-colors';

  return (
    <article key={post.slug} className="bg-white min-h-screen pt-28 md:pt-36">
      <Seo title={title} description={description} view={`journal/${post.slug}`} image={absolute(post.cover)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="px-5 md:px-12 max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <li><Link href="/" className={crumb}>Home</Link></li>
            <li aria-hidden className="text-zinc-300">/</li>
            <li><Link href="/journal" className={crumb}>Journal</Link></li>
          </ol>
        </nav>
        <Meta post={post} className="mt-10 md:mt-14" />
        <h1 className="mt-5 text-5xl md:text-7xl font-bold leading-[0.98] tracking-[-0.05em] text-black">
          <Reveal>{post.title}</Reveal>
        </h1>
        {post.excerpt && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.25 }} className="mt-8 text-xl md:text-2xl font-medium tracking-[-0.02em] leading-[1.4] text-zinc-600">
            {post.excerpt}
          </motion.p>
        )}
        {(post.author || post.tags.length > 0) && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {post.author && <span className="mr-2 text-sm font-semibold text-black">By {post.author}</span>}
            {post.tags.map((t) => <span key={t} className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold">{t}</span>)}
          </div>
        )}
      </header>

      {post.cover && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease, delay: 0.35 }} className="mt-12 md:mt-16 px-3 md:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
            <img src={post.cover} alt={post.coverAlt} width={1200} height={630} fetchpriority="high" className="block w-full h-auto" />
          </div>
        </motion.div>
      )}

      {headings.length >= 3 ? (
        <div className="px-5 md:px-12 max-w-6xl mx-auto mt-14 md:mt-20 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <aside className="hidden lg:block">
            <nav aria-label="Table of contents" className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">On this page</p>
              <TocList items={headings} active={active} />
            </nav>
          </aside>

          <div className="min-w-0 max-w-3xl">
            {/* Phones and tablets: a fold-out list above the article */}
            <nav aria-label="Table of contents" className="lg:hidden mb-12 rounded-3xl border border-zinc-200">
              <button onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen} className="w-full flex items-center justify-between px-6 py-5 text-left">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">On this page</span>
                <span className={`w-8 h-8 rounded-full border border-zinc-200 grid place-items-center text-black transition-transform duration-500 ${tocOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              <motion.div initial={false} animate={{ height: tocOpen ? 'auto' : 0, opacity: tocOpen ? 1 : 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
                <div className="px-6 pb-6">
                  <TocList items={headings.filter((t) => t.depth === 2)} active={null} onPick={() => setTocOpen(false)} />
                </div>
              </motion.div>
            </nav>

            <div className="journal-prose" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      ) : (
        <div className="journal-prose px-5 md:px-12 max-w-3xl mx-auto mt-14 md:mt-20" dangerouslySetInnerHTML={{ __html: html }} />
      )}

      <section className="mt-24 md:mt-36 px-5 md:px-12 max-w-7xl mx-auto border-t border-zinc-200 pt-14 md:pt-20">
        <Label>Related services</Label>
        <h2 className="mt-5 text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02]">
          Need a hand with <span className="italic text-[#703FEC]">this?</span>
        </h2>
        <ul className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((sv) => (
            <li key={sv.slug}>
              <Link href={servicePath(sv.slug)} className="group flex h-full items-center justify-between gap-4 rounded-[2rem] border border-zinc-200 px-7 py-6 hover:border-black transition-colors">
                <span className="text-xl md:text-2xl font-bold tracking-[-0.03em] leading-tight">{sv.name}</span>
                <span className="w-10 h-10 shrink-0 rounded-full bg-black text-white grid place-items-center transition-[transform,background-color] duration-500 group-hover:-rotate-45 group-hover:bg-[#703FEC]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {more.length > 0 && (
        <section className="mt-24 md:mt-36 px-5 md:px-12 max-w-7xl mx-auto border-t border-zinc-200 pt-14 md:pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Label>Related posts</Label>
              <h2 className="mt-5 text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02]">
                More from the <span className="italic text-[#703FEC]">journal.</span>
              </h2>
            </div>
            <Link href="/journal" className="group inline-flex items-center gap-3 self-start md:self-auto text-[11px] font-bold uppercase tracking-[0.25em] text-black">
              All posts
              <span className="w-10 h-10 rounded-full border border-zinc-200 grid place-items-center transition-all duration-500 group-hover:bg-[#703FEC] group-hover:border-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
            </Link>
          </div>
          <div className={`mt-12 md:mt-16 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 ${more.length > 2 ? 'lg:grid-cols-3' : ''}`}>
            {more.map((p, i) => <PostCard key={p.slug} post={p} onOpen={onOpen} delay={i * 0.08} />)}
          </div>
        </section>
      )}

      <section className="px-5 md:px-12 max-w-7xl mx-auto py-16 md:py-24 mt-16 md:mt-20 border-t border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <p className="text-2xl md:text-3xl font-bold tracking-[-0.03em]">Want us to build something like this for you?</p>
        <Link href="/contact" className="group inline-flex items-center gap-4 self-start rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
          Start a project
          <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
        </Link>
      </section>
    </article>
  );
};

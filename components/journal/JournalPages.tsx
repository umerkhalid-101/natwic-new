import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Marked } from 'marked';
import { POSTS, Post, postBySlug, postMeta, formatDate } from './posts';
import { Seo } from '../Seo';
import { Magnetic } from '../Magnetic';
import { BASE_URL, postUrl } from '../../seo';

const ease = [0.16, 1, 0.3, 1] as const;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const absolute = (src?: string) => (src && src.startsWith('/') ? `${BASE_URL}${src}` : src);

// Body images load lazily; links that leave the site open in a new tab
const md = new Marked({
  gfm: true,
  renderer: {
    image({ href, title, text }) {
      const caption = title ? `<figcaption>${esc(title)}</figcaption>` : '';
      return `<figure><img src="${esc(href)}" alt="${esc(text)}" loading="lazy" decoding="async" />${caption}</figure>`;
    },
    link({ href, title, tokens }) {
      const external = /^https?:\/\//.test(href) && !href.startsWith(BASE_URL);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${attrs}>${this.parser.parseInline(tokens)}</a>`;
    },
  },
});

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500 ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
    {children}
  </p>
);

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay }}>
      {children}
    </motion.span>
  </span>
);

// Real links for crawlers; plain clicks stay in the app
const spaClick = (go: () => void) => (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  go();
};

const Meta: React.FC<{ post: Post; className?: string }> = ({ post, className = '' }) => (
  <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 ${className}`}>
    <time dateTime={post.date}>{formatDate(post.date)}</time>
    <span aria-hidden className="text-zinc-300">·</span>
    <span>{post.readingMinutes} min read</span>
    {post.draft && <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 tracking-[0.15em]">Draft</span>}
  </p>
);

const Cover: React.FC<{ post: Post; className?: string; eager?: boolean }> = ({ post, className = '', eager }) =>
  post.cover ? (
    <img
      src={post.cover}
      alt={post.coverAlt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04] ${className}`}
    />
  ) : (
    <div aria-hidden className={`w-full h-full bg-[#0A0A0A] bg-[radial-gradient(circle_at_30%_20%,rgba(112,63,236,0.55),transparent_60%)] ${className}`} />
  );

/* ------------------------------------------------------------------ */
/* /journal: the index                                                 */
/* ------------------------------------------------------------------ */

export const JournalIndex: React.FC<{ onOpen: (slug: string) => void; onContact: () => void }> = ({ onOpen, onContact }) => {
  const [lead, ...rest] = POSTS;

  return (
    <div className="bg-white min-h-screen pt-28 md:pt-36 pb-24 md:pb-32">
      <section className="px-5 md:px-12 max-w-7xl mx-auto">
        <Label>Notes from the studio</Label>
        <h1 className="mt-6 text-[20vw] md:text-[13vw] font-bold leading-[0.82] tracking-[-0.06em] text-black">
          <Reveal>Journal</Reveal>
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
            <div className="aspect-[16/10] overflow-hidden rounded-[2rem]">
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
          {rest.map((p, i) => (
            <motion.a
              key={p.slug}
              href={`/journal/${p.slug}`}
              onClick={spaClick(() => onOpen(p.slug))}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.9, ease, delay: (i % 3) * 0.08 }}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-3xl">
                <Cover post={p} />
              </div>
              <Meta post={p} className="mt-6" />
              <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-[-0.035em] leading-[1.1] text-black transition-colors duration-500 group-hover:text-[#703FEC]">{p.title}</h3>
              {p.excerpt && <p className="mt-3 text-zinc-600 leading-relaxed line-clamp-3">{p.excerpt}</p>}
            </motion.a>
          ))}
        </section>
      )}

      <section className="mt-24 md:mt-32 px-5 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02] max-w-2xl">
          Got something to <span className="italic text-[#703FEC]">build?</span>
        </h2>
        <Magnetic strength={0.3}>
          <button onClick={onContact} className="group inline-flex items-center gap-4 rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
            Start a project
            <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
          </button>
        </Magnetic>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* /journal/<slug>: a post                                             */
/* ------------------------------------------------------------------ */

export const JournalPost: React.FC<{ slug: string; onOpen: (slug: string) => void; onAll: () => void; onHome: () => void; onContact: () => void }> = ({ slug, onOpen, onAll, onHome, onContact }) => {
  const post = postBySlug(slug);
  const html = useMemo(() => (post ? (md.parse(post.body) as string) : ''), [post]);

  if (!post) {
    return (
      <div className="bg-white min-h-screen pt-40 px-5 md:px-12 max-w-3xl mx-auto">
        <Seo title="Post not found | Natwic" description="This journal post does not exist." view={`journal/${slug}`} />
        <Label>Journal</Label>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-[-0.045em] leading-[1.02]">This post doesn’t exist.</h1>
        <a href="/journal" onClick={spaClick(onAll)} className="mt-10 inline-block rounded-full bg-black text-white px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">All posts</a>
      </div>
    );
  }

  const index = POSTS.indexOf(post);
  const more = POSTS.filter((p) => p !== post).slice(0, 2);
  const url = postUrl(post.slug);
  const { title, description } = postMeta(post);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description,
      datePublished: post.date,
      url,
      mainEntityOfPage: url,
      ...(post.cover ? { image: absolute(post.cover) } : {}),
      author: post.author ? { '@type': 'Person', name: post.author } : { '@type': 'Organization', name: 'Natwic' },
      publisher: { '@type': 'Organization', name: 'Natwic', logo: { '@type': 'ImageObject', url: `${BASE_URL}/brand/icon-512.png` } },
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
            <li><a href="/" onClick={spaClick(onHome)} className={crumb}>Home</a></li>
            <li aria-hidden className="text-zinc-300">/</li>
            <li><a href="/journal" onClick={spaClick(onAll)} className={crumb}>Journal</a></li>
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
          <div className="mx-auto max-w-6xl aspect-[16/9] overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
            <img src={post.cover} alt={post.coverAlt} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      )}

      <div className="journal-prose px-5 md:px-12 max-w-3xl mx-auto mt-14 md:mt-20" dangerouslySetInnerHTML={{ __html: html }} />

      {more.length > 0 && (
        <section className="mt-24 md:mt-32 px-5 md:px-12 max-w-7xl mx-auto border-t border-zinc-200 pt-14">
          <Label>{index === 0 ? 'Earlier posts' : 'More from the journal'}</Label>
          <div className="mt-10 grid md:grid-cols-2 gap-10">
            {more.map((p) => (
              <a key={p.slug} href={`/journal/${p.slug}`} onClick={spaClick(() => onOpen(p.slug))} className="group grid grid-cols-[7rem_1fr] md:grid-cols-[10rem_1fr] gap-5 items-center">
                <div className="aspect-square overflow-hidden rounded-2xl"><Cover post={p} /></div>
                <div>
                  <Meta post={p} />
                  <p className="mt-2 text-xl md:text-2xl font-bold tracking-[-0.03em] leading-tight text-black transition-colors duration-500 group-hover:text-[#703FEC]">{p.title}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="px-5 md:px-12 max-w-7xl mx-auto py-16 md:py-24 mt-16 md:mt-20 border-t border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <p className="text-2xl md:text-3xl font-bold tracking-[-0.03em]">Want us to build something like this for you?</p>
        <button onClick={onContact} className="group inline-flex items-center gap-4 self-start rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
          Start a project
          <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
        </button>
      </section>
    </article>
  );
};

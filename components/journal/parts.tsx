/** Pieces shared by the journal pages and the journal teaser on other pages. */

import React from 'react';
import { motion } from 'framer-motion';
import { Post, formatDate } from './posts';

export const ease = [0.16, 1, 0.3, 1] as const;

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500 ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
    {children}
  </p>
);

export const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay }}>
      {children}
    </motion.span>
  </span>
);

// Real links for crawlers; plain clicks stay in the app
export const spaClick = (go: () => void) => (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  go();
};

export const Meta: React.FC<{ post: Post; className?: string }> = ({ post, className = '' }) => (
  <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 ${className}`}>
    <time dateTime={post.date}>{formatDate(post.date)}</time>
    <span aria-hidden className="text-zinc-300">·</span>
    <span>{post.readingMinutes} min read</span>
    {post.draft && <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 tracking-[0.15em]">Draft</span>}
  </p>
);

// `framed`: fits the whole image inside a fixed 1200×630 frame, so cards in a row line up
export const Cover: React.FC<{ post: Post; className?: string; eager?: boolean; framed?: boolean }> = ({ post, className = '', eager, framed }) =>
  post.cover ? (
    <img
      src={post.cover}
      alt={post.coverAlt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`block w-full ${framed ? 'aspect-[1200/630] object-contain bg-zinc-100' : 'h-auto'} transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04] ${className}`}
    />
  ) : (
    <div aria-hidden className={`w-full aspect-[1200/630] bg-[#0A0A0A] bg-[radial-gradient(circle_at_30%_20%,rgba(112,63,236,0.55),transparent_60%)] ${className}`} />
  );

export const PostCard: React.FC<{ post: Post; onOpen: (slug: string) => void; delay?: number }> = ({ post, onOpen, delay = 0 }) => (
  <motion.a
    href={`/journal/${post.slug}`}
    onClick={spaClick(() => onOpen(post.slug))}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-5%' }}
    transition={{ duration: 0.9, ease, delay }}
    className="group block"
  >
    <div className="overflow-hidden rounded-3xl">
      <Cover post={post} framed />
    </div>
    <Meta post={post} className="mt-6" />
    <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-[-0.035em] leading-[1.1] text-black transition-colors duration-500 group-hover:text-[#703FEC]">{post.title}</h3>
    {post.excerpt && <p className="mt-3 text-zinc-600 leading-relaxed line-clamp-3">{post.excerpt}</p>}
  </motion.a>
);

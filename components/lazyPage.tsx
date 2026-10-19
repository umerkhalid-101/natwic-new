import React, { lazy } from 'react';

type Preloadable<P> = React.FC<P> & { preload: () => Promise<void> };

/**
 * React.lazy plus a `preload()` that resolves the chunk ahead of time. Once preloaded,
 * the component renders straight away instead of suspending, so the pre-rendered HTML
 * is replaced by the same page, not by an empty Suspense fallback.
 */
export function lazyPage<M, P extends object>(load: () => Promise<M>, pick: (m: M) => React.ComponentType<P>): Preloadable<P> {
  let Loaded: React.ComponentType<P> | null = null;
  const preload = () => load().then((m) => { Loaded = pick(m); });
  const Lazy = lazy(() => preload().then(() => ({ default: Loaded! })));
  const Page = ((props: P) => (Loaded ? <Loaded {...props} /> : <Lazy {...props} />)) as Preloadable<P>;
  Page.preload = preload;
  return Page;
}

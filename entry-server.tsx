import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import App from './App';
import type { View } from './seo';

export { ROUTE_META, VIEWS, urlFor } from './seo';

/** Renders one page to HTML at build time, waiting for lazy-loaded pages to resolve. */
export const render = (view: View) =>
  new Promise<string>((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, done) { html += chunk.toString(); done(); },
      final(done) { resolve(html); done(); },
    });
    const stream = renderToPipeableStream(<App initialView={view} />, {
      onAllReady() { stream.pipe(sink); },
      onShellError: reject,
      onError(err) { console.warn(`[prerender:${view}]`, err); },
    });
  });

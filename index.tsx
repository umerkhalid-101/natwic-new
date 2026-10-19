import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App, { preloadRoute } from './App';
import './index.css';
import { viewFromPath, slugFromPath } from './seo';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Built pages hold pre-rendered HTML: once this page's code has loaded, React adopts that HTML
// (hydration) instead of repainting it, so it shows at first paint and never flashes.
// The dev server serves an empty root, so it renders from scratch.
const { pathname } = window.location;
const app = (
  <React.StrictMode>
    <App initialView={viewFromPath(pathname)} initialSlug={slugFromPath(pathname)} />
  </React.StrictMode>
);
preloadRoute(pathname).then(() => {
  if (rootElement.hasChildNodes()) ReactDOM.hydrateRoot(rootElement, app);
  else ReactDOM.createRoot(rootElement).render(app);
});
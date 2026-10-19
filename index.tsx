import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App, { preloadRoute } from './App';
import './index.css';
import { viewFromPath, slugFromPath } from './seo';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// The page holds pre-rendered HTML; it stays on screen until this page's code has loaded,
// then the app renders the same page over it (no blank frame, no layout shift)
const { pathname } = window.location;
preloadRoute(pathname).then(() => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App initialView={viewFromPath(pathname)} initialSlug={slugFromPath(pathname)} />
    </React.StrictMode>
  );
});
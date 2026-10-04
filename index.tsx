import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { viewFromPath, slugFromPath } from './seo';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// The page may hold pre-rendered HTML for crawlers; the app renders fresh over it
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App initialView={viewFromPath(window.location.pathname)} initialSlug={slugFromPath(window.location.pathname)} />
  </React.StrictMode>
);
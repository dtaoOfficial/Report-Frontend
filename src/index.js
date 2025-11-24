import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ Create root and hydrate faster
const root = ReactDOM.createRoot(document.getElementById('root'));

// ✅ Optional preload manifest & SEO meta injection
const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = `${process.env.PUBLIC_URL}/manifest.json`;
document.head.appendChild(manifestLink);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait" initial={false}>
          <App />
        </AnimatePresence>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// ✅ Log performance data (for Lighthouse)
reportWebVitals();

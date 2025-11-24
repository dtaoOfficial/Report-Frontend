import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEOHelmet Component
 * Dynamically sets the title, meta tags, and Open Graph data for SEO optimization.
 * Compatible with react-helmet-async (already configured in index.js)
 */

const SEOHelmet = ({
  title = 'DTAO BASE | Multi-Department Report Management',
  description = 'Streamline and manage department reports, approvals, and workflows efficiently with DTAO BASE.',
  keywords = 'DTAO, Report Management, Workflow System, Admin Dashboard, University Reports',
  image = '/assets/seo-preview.png',
  url = window.location.href,
}) => {
  return (
    <Helmet>
      {/* ✅ Standard SEO Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="DTAO BASE Team" />

      {/* ✅ Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* ✅ Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ✅ Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHelmet;

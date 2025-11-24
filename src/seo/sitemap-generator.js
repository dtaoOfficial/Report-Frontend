/**
 * 🗺️ DTAO BASE Sitemap Generator (CommonJS version)
 * Run with: node src/seo/sitemap-generator.js
 */

const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const BASE_URL = 'https://yourdomain.com'; // 🔧 Update to your real domain

const routes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/verify-reset-otp',
  '/reset-password',
  '/user/dashboard',
  '/admin/dashboard',
  '/system/dashboard',
  '/principal/dashboard',
  '/dean/dashboard',
  '/resources/dashboard',
  '/about'
];

async function generateSitemap() {
  try {
    const sitemap = new SitemapStream({ hostname: BASE_URL });
    routes.forEach((url) => sitemap.write({ url, changefreq: 'weekly', priority: 0.8 }));
    sitemap.end();

    const data = await streamToPromise(sitemap);
    const outputPath = path.resolve('./public/sitemap.xml');
    fs.writeFileSync(outputPath, data.toString());

    console.log('✅ Sitemap generated successfully at /public/sitemap.xml');
  } catch (err) {
    console.error('❌ Error generating sitemap:', err);
  }
}

generateSitemap();

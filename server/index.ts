import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import routes from './routes';
import adminRoutes from './admin-routes';
import { startEmailScheduler } from './email-scheduler';
import { registerObjectStorageRoutes } from './replit_integrations/object_storage';
import { seedDatabase } from './seed';
import { seoMiddleware } from './seo-middleware';

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? 5000 : Number(process.env.PORT || 3001);

app.use((req, res, next) => {
  const host = req.get('host') || '';
  if (host.includes('tracker.kikithetoothfairy.co')) {
    const newUrl = `https://kikithetoothfairy.co${req.originalUrl}`;
    return res.redirect(301, newUrl);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(adminRoutes);
registerObjectStorageRoutes(app);

const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

const knownRoutes = [
  '/',
  '/tracker',
  '/blogs/kikis-blog',
  '/pages/faq',
  '/pages/contact',
  '/media-kit',
  '/emails',
  '/policies/privacy-policy',
  '/policies/terms-of-service',
  '/policies/shipping-policy',
  '/policies/refund-policy',
  '/admin',
  '/admin/cms',
  '/templates/intent-landing',
  '/blog',
  '/privacy',
  '/terms',
  '/shipping',
  '/refund',
  '/faq',
  '/contact',
];

const knownDynamicRoutes = [
  /^\/tracker\/[^/]+$/,
  /^\/blogs\/kikis-blog\/[^/]+$/,
];

function isKnownRoute(path: string): boolean {
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  if (knownRoutes.includes(normalizedPath)) return true;
  return knownDynamicRoutes.some(regex => regex.test(normalizedPath));
}

app.get('/*splat', async (req, res) => {
  try {
    const indexPath = path.join(distPath, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    const modifiedHtml = await seoMiddleware(req.path, indexHtml);
    res.setHeader('Content-Type', 'text/html');
    
    if (!isKnownRoute(req.path)) {
      res.status(404);
    }
    
    res.send(modifiedHtml);
  } catch (error) {
    console.error('Error serving page with SEO:', error);
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  await seedDatabase();
  startEmailScheduler();
});

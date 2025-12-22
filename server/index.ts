import 'dotenv/config';
import express from 'express';
import path from 'path';
import routes from './routes';
import adminRoutes from './admin-routes';
import { startEmailScheduler } from './email-scheduler';
import { registerObjectStorageRoutes } from './replit_integrations/object_storage';

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? 5000 : (process.env.PORT || 3001);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(adminRoutes);
registerObjectStorageRoutes(app);

const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  startEmailScheduler();
});

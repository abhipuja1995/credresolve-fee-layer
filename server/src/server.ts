import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/api.js';

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'credresolve-fee-layer-server', timestamp: new Date().toISOString() });
  });

  // API router
  app.use('/api', apiRouter);

  return app;
}

import express from 'express';
import { DEFAULT_RATE_LIMIT_PER_MINUTE } from './config/constants.js';
import { apiNotFound, errorHandler } from './middlewares/error-handler.js';
import { createApiLimiter } from './middlewares/rate-limiters.js';
import { createSecurityMiddlewares } from './middlewares/security.js';
import { mountStaticSite } from './middlewares/static-site.js';
import { createRepositories } from './repositories/index.js';
import { createApiRouter } from './routes/index.js';
import { createServices } from './services/index.js';

export function createApp({ db, jwtSecret, staticDir, mailer, rateLimitMax = DEFAULT_RATE_LIMIT_PER_MINUTE }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(...createSecurityMiddlewares());
  app.use('/api', createApiLimiter(rateLimitMax));

  const services = createServices({ repositories: createRepositories(db), jwtSecret, mailer });
  app.use('/api', createApiRouter({ services, rateLimitMax }), apiNotFound);

  mountStaticSite(app, staticDir);
  app.use(errorHandler);
  return app;
}

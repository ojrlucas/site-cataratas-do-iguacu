import { Router } from 'express';
import { createAuthenticate } from '../middlewares/authenticate.js';
import { createAuthLimiter } from '../middlewares/rate-limiters.js';
import { requireSuperadmin } from '../middlewares/require-superadmin.js';
import { createAdminRoutes } from './admin.js';
import { createAuthRoutes } from './auth.js';
import { createPedidosRoutes } from './pedidos.js';
import { createPublicRoutes } from './public.js';

export function createApiRouter({ services, rateLimitMax }) {
  const authenticate = createAuthenticate(services.auth);
  const authLimiter = createAuthLimiter(rateLimitMax);
  const router = Router();

  router.use(createPublicRoutes(services));
  router.use('/auth', createAuthRoutes({ auth: services.auth, authenticate, authLimiter }));
  router.use('/pedidos', createPedidosRoutes({ pedidos: services.pedidos, authenticate }));
  router.use('/admin', createAdminRoutes({ ...services, authenticate, requireSuperadmin }));

  return router;
}

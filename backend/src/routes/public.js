import { Router } from 'express';
import { parque } from '../content/initial-content.js';

export function createPublicRoutes({ catalogo }) {
  const router = Router();
  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  router.get('/parque', (_req, res) => res.json(parque));
  router.get('/atividades', (_req, res) => res.json(catalogo.listActivities()));
  router.get('/ingressos/tipos', (_req, res) => res.json(catalogo.listActiveTicketTypes()));
  return router;
}

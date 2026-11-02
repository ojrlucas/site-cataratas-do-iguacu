import { Router } from 'express';
import { validate } from '../shared/validate.js';
import { atividadeSchema, papelSchema, tipoSchema } from '../validators/admin.js';

export function createAdminRoutes({ painel, catalogoAdmin, authenticate, requireSuperadmin }) {
  const router = Router();
  router.use(authenticate, requireSuperadmin);

  router.get('/resumo', (_req, res) => res.json(painel.summary()));
  router.get('/pedidos', (_req, res) => res.json(painel.listOrders()));
  router.get('/usuarios', (_req, res) => res.json(painel.listUsers()));

  router.patch('/usuarios/:id', (req, res) => {
    const { papel } = validate(papelSchema, req.body);
    res.json(painel.changeRole(req.usuario, Number(req.params.id), papel));
  });

  router.get('/tipos', (_req, res) => res.json(catalogoAdmin.listTicketTypes()));
  router.post('/tipos', (req, res) => res.status(201).json(catalogoAdmin.createTicketType(validate(tipoSchema, req.body))));
  router.put('/tipos/:id', (req, res) => {
    res.json(catalogoAdmin.updateTicketType(req.params.id, validate(tipoSchema, req.body)));
  });

  router.post('/atividades', (req, res) => {
    res.status(201).json(catalogoAdmin.createActivity(validate(atividadeSchema, req.body)));
  });
  router.put('/atividades/:id', (req, res) => {
    res.json(catalogoAdmin.updateActivity(req.params.id, validate(atividadeSchema, req.body)));
  });
  router.delete('/atividades/:id', (req, res) => {
    catalogoAdmin.removeActivity(req.params.id);
    res.status(204).end();
  });

  return router;
}

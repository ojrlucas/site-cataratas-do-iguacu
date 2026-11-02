import { Router } from 'express';
import { validate } from '../shared/validate.js';
import { pedidoSchema } from '../validators/pedidos.js';

export function createPedidosRoutes({ pedidos, authenticate }) {
  const router = Router();
  router.use(authenticate);

  router.post('/', async (req, res) => {
    res.status(201).json(await pedidos.create(req.usuario, validate(pedidoSchema, req.body)));
  });

  router.get('/', (req, res) => res.json(pedidos.listFor(req.usuario)));

  router.get('/:id/qrcode', async (req, res) => {
    res.json(await pedidos.getWithQrCode(req.usuario, req.params.id));
  });

  router.post('/:id/reenviar', async (req, res) => {
    res.json(await pedidos.resendReceipt(req.usuario, req.params.id));
  });

  return router;
}

import { Router } from 'express';
import { serializeUsuario } from '../serializers/usuario.js';
import { validate } from '../shared/validate.js';
import { esqueciSenhaSchema, loginSchema, registroSchema } from '../validators/auth.js';

export function createAuthRoutes({ auth, authenticate, authLimiter }) {
  const router = Router();

  router.post('/registro', authLimiter, (req, res) => {
    res.status(201).json(auth.register(validate(registroSchema, req.body)));
  });

  router.post('/login', authLimiter, (req, res) => {
    res.json(auth.login(validate(loginSchema, req.body)));
  });

  router.post('/esqueci-senha', authLimiter, (req, res) => {
    validate(esqueciSenhaSchema, req.body);
    res.json(auth.requestPasswordReset());
  });

  router.get('/me', authenticate, (req, res) => res.json(serializeUsuario(req.usuario)));

  return router;
}

import { unauthorized } from '../shared/http-error.js';

const BEARER_PREFIX = 'Bearer ';

export function createAuthenticate(authService) {
  return (req, _res, next) => {
    try {
      const header = req.headers.authorization || '';
      if (!header.startsWith(BEARER_PREFIX)) {
        throw unauthorized('Sessão inválida ou expirada. Faça login novamente.');
      }
      req.usuario = authService.authenticate(header.slice(BEARER_PREFIX.length));
      next();
    } catch (error) {
      next(error);
    }
  };
}

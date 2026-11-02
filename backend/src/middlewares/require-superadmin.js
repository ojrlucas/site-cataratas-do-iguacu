import { ROLES } from '../config/constants.js';
import { forbidden } from '../shared/http-error.js';

export const requireSuperadmin = (req, _res, next) =>
  next(req.usuario.papel === ROLES.SUPERADMIN ? undefined : forbidden('Acesso restrito a superadmins'));

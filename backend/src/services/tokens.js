import jwt from 'jsonwebtoken';
import { JWT_ALGORITHM, JWT_EXPIRES_IN } from '../config/constants.js';

export function createTokenService(secret) {
  return {
    sign: (usuario) => jwt.sign({ sub: usuario.id }, secret, { algorithm: JWT_ALGORITHM, expiresIn: JWT_EXPIRES_IN }),
    verify: (token) => jwt.verify(token, secret, { algorithms: [JWT_ALGORITHM] }).sub,
  };
}

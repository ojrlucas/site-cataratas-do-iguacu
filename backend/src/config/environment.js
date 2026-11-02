import crypto from 'node:crypto';
import path from 'node:path';
import { MIN_JWT_SECRET_LENGTH } from './constants.js';

export const resolveDataDir = (env, baseDir) => env.DATA_DIR || path.join(baseDir, '..', 'data');

export function loadEnvironment(env, baseDir) {
  const isProduction = env.NODE_ENV === 'production';
  const secret = env.JWT_SECRET;
  if (isProduction && (!secret || secret.length < MIN_JWT_SECRET_LENGTH)) {
    throw new Error(`JWT_SECRET é obrigatório em produção e deve ter ao menos ${MIN_JWT_SECRET_LENGTH} caracteres.`);
  }
  return {
    port: Number(env.PORT) || 3000,
    dataDir: resolveDataDir(env, baseDir),
    jwtSecret: secret || crypto.randomBytes(32).toString('hex'),
    staticDir: env.STATIC_DIR,
    isProduction,
  };
}

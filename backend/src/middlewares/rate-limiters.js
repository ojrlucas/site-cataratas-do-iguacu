import rateLimit from 'express-rate-limit';
import { API_RATE_LIMIT_WINDOW_MS, AUTH_RATE_LIMIT_WINDOW_MS, MIN_AUTH_RATE_LIMIT } from '../config/constants.js';

const baseOptions = { standardHeaders: true, legacyHeaders: false };

export const createApiLimiter = (limitPerMinute) =>
  rateLimit({ ...baseOptions, windowMs: API_RATE_LIMIT_WINDOW_MS, limit: limitPerMinute });

export const createAuthLimiter = (limitPerMinute) =>
  rateLimit({
    ...baseOptions,
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
    limit: Math.max(limitPerMinute / 6, MIN_AUTH_RATE_LIMIT),
    message: { erro: 'Muitas tentativas. Tente novamente mais tarde.' },
  });

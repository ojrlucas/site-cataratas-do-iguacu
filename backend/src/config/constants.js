export const BCRYPT_COST = 12;
export const JWT_ALGORITHM = 'HS256';
export const JWT_EXPIRES_IN = '7d';
export const JSON_BODY_LIMIT = '50kb';
export const DEFAULT_RATE_LIMIT_PER_MINUTE = 300;
export const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60_000;
export const API_RATE_LIMIT_WINDOW_MS = 60_000;
export const MIN_AUTH_RATE_LIMIT = 20;
export const MAX_ADMIN_ORDERS = 500;
export const QR_CODE_WIDTH = 300;
export const ORDER_CODE_PREFIX = 'CPI-';
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;
export const MIN_JWT_SECRET_LENGTH = 32;
export const ROLES = Object.freeze({ USER: 'usuario', SUPERADMIN: 'superadmin' });

export const CONTENT_SECURITY_POLICY = Object.freeze({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:'],
  fontSrc: ["'self'", 'data:'],
  connectSrc: ["'self'"],
  frameSrc: ['https://www.google.com'],
  frameAncestors: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
});

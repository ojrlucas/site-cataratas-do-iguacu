import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { CONTENT_SECURITY_POLICY, JSON_BODY_LIMIT } from '../config/constants.js';

export function createSecurityMiddlewares() {
  return [
    helmet({
      referrerPolicy: { policy: 'no-referrer' },
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      contentSecurityPolicy: { directives: CONTENT_SECURITY_POLICY },
    }),
    cors(),
    express.json({ limit: JSON_BODY_LIMIT }),
  ];
}

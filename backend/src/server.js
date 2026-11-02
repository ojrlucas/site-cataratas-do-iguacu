import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';
import { createApp } from './app.js';
import { createMailer } from './mailer.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;
const dataDir = process.env.DATA_DIR || path.join(here, '..', 'data');
let jwtSecret = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && (!jwtSecret || jwtSecret.length < 32)) {
  console.error('JWT_SECRET é obrigatório em produção e deve ter ao menos 32 caracteres.');
  process.exit(1);
}
if (!jwtSecret) jwtSecret = crypto.randomBytes(32).toString('hex');

const app = createApp({
  db: openDb(path.join(dataDir, 'cataratas.db')),
  jwtSecret,
  mailer: createMailer(),
  staticDir: process.env.STATIC_DIR,
});
app.listen(port, () => console.log(`API Cataratas do Iguaçu em http://0.0.0.0:${port}`));

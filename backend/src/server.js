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
if (!jwtSecret) {
  jwtSecret = crypto.randomBytes(32).toString('hex');
  console.warn('[aviso] JWT_SECRET não definido: usando segredo temporário (sessões caem ao reiniciar).');
}

const app = createApp({
  db: openDb(path.join(dataDir, 'cataratas.db')),
  jwtSecret,
  mailer: createMailer(),
  staticDir: process.env.STATIC_DIR,
});
app.listen(port, () => console.log(`API Cataratas do Iguaçu em http://0.0.0.0:${port}`));

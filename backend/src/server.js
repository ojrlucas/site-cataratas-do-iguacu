import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { loadEnvironment } from './config/environment.js';
import { openDb } from './database/connection.js';
import { createMailer } from './email/mailer.js';

const baseDir = path.dirname(fileURLToPath(import.meta.url));

function loadEnvironmentOrExit() {
  try {
    return loadEnvironment(process.env, baseDir);
  } catch (error) {
    console.error(error.message);
    return process.exit(1);
  }
}

const environment = loadEnvironmentOrExit();
const app = createApp({
  db: openDb(path.join(environment.dataDir, 'cataratas.db')),
  jwtSecret: environment.jwtSecret,
  mailer: createMailer(),
  staticDir: environment.staticDir,
});

app.listen(environment.port, () => console.log(`API Cataratas do Iguaçu em http://0.0.0.0:${environment.port}`));

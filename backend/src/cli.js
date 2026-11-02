import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveDataDir } from './config/environment.js';
import { openDb } from './database/connection.js';
import { run } from './cli/index.js';

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const db = openDb(path.join(resolveDataDir(process.env, baseDir), 'cataratas.db'));

run(process.argv.slice(2), db).then(
  (code) => process.exit(code),
  (error) => {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  },
);

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { createSchema } from './schema.js';
import { seedDatabase } from './seed.js';

export function openDb(file) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  createSchema(db);
  seedDatabase(db);
  return db;
}

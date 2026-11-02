import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { atividades, tiposIngresso } from './data.js';

export function openDb(file) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT NOT NULL DEFAULT '',
      senha_hash TEXT NOT NULL,
      papel TEXT NOT NULL DEFAULT 'usuario' CHECK (papel IN ('usuario','superadmin')),
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tipos_ingresso (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      preco_centavos INTEGER NOT NULL,
      imagem TEXT NOT NULL,
      descricao TEXT NOT NULL,
      ativo INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS atividades (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      imagem TEXT NOT NULL,
      alt TEXT NOT NULL,
      descricao TEXT NOT NULL,
      ordem INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT NOT NULL UNIQUE,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      tipo_id TEXT NOT NULL,
      tipo_nome TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      data_visita TEXT NOT NULL,
      total_centavos INTEGER NOT NULL,
      email_enviado INTEGER NOT NULL DEFAULT 0,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  if (db.prepare('SELECT COUNT(*) c FROM tipos_ingresso').get().c === 0) {
    const ins = db.prepare('INSERT INTO tipos_ingresso (id,nome,preco_centavos,imagem,descricao) VALUES (?,?,?,?,?)');
    for (const t of tiposIngresso) ins.run(t.id, t.nome, t.precoCentavos, t.imagem, t.descricao);
  }
  if (db.prepare('SELECT COUNT(*) c FROM atividades').get().c === 0) {
    const ins = db.prepare('INSERT INTO atividades (id,titulo,imagem,alt,descricao,ordem) VALUES (?,?,?,?,?,?)');
    atividades.forEach((a, i) => ins.run(a.id, a.titulo, a.imagem, a.alt, a.descricao, i));
  }
  return db;
}

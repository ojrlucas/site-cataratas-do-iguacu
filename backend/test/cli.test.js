import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../src/database/connection.js';
import { run } from '../src/cli/index.js';

test('CLI superadmin: criar, atualizar, promover, rebaixar, listar', async () => {
  const db = openDb(':memory:');
  const out = [];
  const log = (m) => out.push(m);
  await run(['superadmin', 'criar', '--email', 'Admin@Ex.com', '--nome', 'Admin Geral', '--senha', 'senha1234'], db, log);
  const u = db.prepare('SELECT * FROM usuarios WHERE email=?').get('admin@ex.com');
  assert.equal(u.papel, 'superadmin');
  await assert.rejects(run(['superadmin', 'criar', '--email', 'b@ex.com', '--nome', 'Bob Bob', '--senha', '1234'], db, log), /entre 8 e 72/);
  await run(['superadmin', 'atualizar', '--email', 'admin@ex.com', '--senha', 'novasenha1', '--novo-email', 'root@ex.com', '--nome', 'Root'], db, log);
  const r = db.prepare('SELECT * FROM usuarios WHERE email=?').get('root@ex.com');
  assert.equal(r.nome, 'Root');
  assert.notEqual(r.senha_hash, u.senha_hash);
  await assert.rejects(run(['superadmin', 'rebaixar', '--email', 'root@ex.com'], db, log), /único superadmin/);
  db.prepare("INSERT INTO usuarios (nome,email,senha_hash) VALUES ('Zé Zé','ze@ex.com','x')").run();
  await run(['superadmin', 'promover', '--email', 'ze@ex.com'], db, log);
  await run(['superadmin', 'rebaixar', '--email', 'root@ex.com'], db, log);
  await run(['superadmin', 'listar'], db, log);
  assert.ok(out.at(-1).includes('ze@ex.com'));
  await assert.rejects(run(['superadmin', 'promover', '--email', 'nao@existe.com'], db, log), /não encontrado/);
});

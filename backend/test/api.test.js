import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../src/db.js';
import { createApp } from '../src/app.js';

const db = openDb(':memory:');
const emails = [];
const mailer = { enviarComprovante: async (m) => { emails.push(m); } };
const app = createApp({ db, jwtSecret: 'teste', mailer, rateLimitMax: 10000 });
const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}/api`;
const call = async (p, opts = {}, token) => {
  const r = await fetch(base + p, { ...opts, headers: { 'content-type': 'application/json', ...(token && { authorization: `Bearer ${token}` }) } });
  const txt = await r.text();
  return { status: r.status, body: txt ? JSON.parse(txt) : null };
};
const post = (p, b, t) => call(p, { method: 'POST', body: JSON.stringify(b) }, t);
const reg = { nome: 'Maria Silva', email: 'Maria@Ex.com', telefone: '45999990000', senha: 'segredo1', confirmacaoSenha: 'segredo1' };
const amanha = new Date(Date.now() + 864e5).toISOString().slice(0, 10);

test.after(() => server.close());

test('conteúdo público', async () => {
  assert.equal((await call('/health')).body.status, 'ok');
  assert.equal((await call('/atividades')).body.length, 6);
  assert.equal((await call('/ingressos/tipos')).body.length, 2);
  assert.ok((await call('/parque')).body.contato.email);
});

test('registro, login e validações', async () => {
  assert.equal((await post('/auth/registro', { ...reg, confirmacaoSenha: 'x' })).status, 400);
  const r = await post('/auth/registro', reg);
  assert.equal(r.status, 201);
  assert.equal(r.body.usuario.email, 'maria@ex.com');
  assert.equal((await post('/auth/registro', reg)).status, 409);
  assert.equal((await post('/auth/login', { email: 'maria@ex.com', senha: 'errada' })).status, 401);
  const l = await post('/auth/login', { email: 'maria@ex.com', senha: 'segredo1' });
  assert.equal(l.status, 200);
  assert.equal((await call('/auth/me', {}, l.body.token)).body.nome, 'Maria Silva');
  assert.equal((await call('/auth/me')).status, 401);
});

test('pedidos e QR code', async () => {
  const { body } = await post('/auth/login', { email: 'maria@ex.com', senha: 'segredo1' });
  const t = body.token;
  assert.equal((await post('/pedidos', { tipoId: 'inteira', quantidade: 1, dataVisita: amanha })).status, 401);
  assert.equal((await post('/pedidos', { tipoId: 'x', quantidade: 1, dataVisita: amanha }, t)).status, 400);
  assert.equal((await post('/pedidos', { tipoId: 'meia', quantidade: 1, dataVisita: '2000-01-01' }, t)).status, 400);
  const p = await post('/pedidos', { tipoId: 'meia', quantidade: 3, dataVisita: amanha }, t);
  assert.equal(p.status, 201);
  assert.equal(p.body.totalCentavos, 15000);
  assert.equal((await call('/pedidos', {}, t)).body.length, 1);
  assert.equal(p.body.emailEnviado, true);
  assert.equal(emails.length, 1);
  assert.equal(emails[0].usuario.email, 'maria@ex.com');
  assert.ok(emails[0].qrPng.length > 100);
  assert.equal((await post(`/pedidos/${p.body.id}/reenviar`, {}, t)).status, 200);
  assert.equal(emails.length, 2);
  const q = await call(`/pedidos/${p.body.id}/qrcode`, {}, t);
  assert.match(q.body.qrcode, /^data:image\/png;base64,/);
  assert.equal((await call('/pedidos/999/qrcode', {}, t)).status, 404);
});

test('superadmin: acesso e gestão', async () => {
  const user = (await post('/auth/login', { email: 'maria@ex.com', senha: 'segredo1' })).body.token;
  assert.equal((await call('/admin/resumo', {}, user)).status, 403);
  assert.equal((await call('/admin/resumo')).status, 401);
  db.prepare("UPDATE usuarios SET papel='superadmin' WHERE email='maria@ex.com'").run();
  const r = await call('/admin/resumo', {}, user);
  assert.equal(r.status, 200);
  assert.equal(r.body.pedidos, 1);
  assert.equal(r.body.ingressos, 3);
  assert.equal((await call('/admin/pedidos', {}, user)).body[0].usuarioEmail, 'maria@ex.com');
  assert.equal((await call('/admin/usuarios', {}, user)).body.length, 1);
  const novo = await post('/admin/tipos', { nome: 'Infantil', precoCentavos: 2500, descricao: 'Crianças até 12 anos', imagem: 'imagens/lazer-2.png', ativo: true }, user);
  assert.equal(novo.status, 201);
  assert.equal(novo.body.id, 'infantil');
  assert.equal((await post('/admin/tipos', { nome: 'x', precoCentavos: -1, descricao: 'abc', imagem: '../x' }, user)).status, 400);
  assert.equal((await call('/ingressos/tipos')).body.length, 3);
  const put = await call('/admin/tipos/infantil', { method: 'PUT', body: JSON.stringify({ nome: 'Infantil', precoCentavos: 3000, descricao: 'Crianças até 12 anos', imagem: 'imagens/lazer-2.png', ativo: false }) }, user);
  assert.equal(put.body.precoCentavos, 3000);
  assert.equal((await call('/ingressos/tipos')).body.length, 2);
  const at = await post('/admin/atividades', { titulo: 'Trilha', descricao: 'Trilha na mata atlântica', imagem: 'imagens/lazer-5.png' }, user);
  assert.equal(at.status, 201);
  assert.equal((await call('/atividades')).body.length, 7);
  assert.equal((await call(`/admin/atividades/${at.body.id}`, { method: 'DELETE' }, user)).status, 204);
});

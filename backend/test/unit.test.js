import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvironment } from '../src/config/environment.js';
import { slugify, uniqueSlug } from '../src/shared/slug.js';
import { isValidDate, today, yesterday } from '../src/shared/dates.js';
import { hashPassword, verifyPassword } from '../src/services/passwords.js';
import { HttpError, badRequest } from '../src/shared/http-error.js';
import { validate } from '../src/shared/validate.js';
import { loginSchema } from '../src/validators/auth.js';
import { parseArguments } from '../src/cli/arguments.js';

test('slugify remove acentos, símbolos e nunca retorna vazio', () => {
  assert.equal(slugify('Meia-Entrada Estudante!'), 'meia-entrada-estudante');
  assert.equal(slugify('Pôr do Sol'), 'por-do-sol');
  assert.equal(slugify('***'), 'item');
});

test('uniqueSlug acrescenta contador quando já existe', () => {
  const usados = new Set(['trilha', 'trilha-2']);
  assert.equal(uniqueSlug('Trilha', (id) => usados.has(id)), 'trilha-3');
});

test('datas: ontem precede hoje e valida formato', () => {
  assert.ok(yesterday() < today());
  assert.ok(isValidDate('2026-11-15'));
  assert.ok(!isValidDate('2026-99-99'));
});

test('senhas: hash confere e usuário inexistente nunca autentica', () => {
  const hash = hashPassword('segredo-forte-1');
  assert.ok(verifyPassword('segredo-forte-1', hash));
  assert.ok(!verifyPassword('outra-senha', hash));
  assert.ok(!verifyPassword('segredo-forte-1', undefined));
});

test('ambiente: produção exige JWT_SECRET longo; desenvolvimento gera um', () => {
  assert.throws(() => loadEnvironment({ NODE_ENV: 'production', JWT_SECRET: 'curto' }, '/app/src'), /JWT_SECRET/);
  const producao = loadEnvironment({ NODE_ENV: 'production', JWT_SECRET: 'x'.repeat(32), PORT: '4000' }, '/app/src');
  assert.equal(producao.port, 4000);
  const desenvolvimento = loadEnvironment({}, '/app/src');
  assert.equal(desenvolvimento.jwtSecret.length, 64);
  assert.equal(desenvolvimento.port, 3000);
});

test('validate normaliza dados e lança HttpError 400 com campos', () => {
  assert.deepEqual(validate(loginSchema, { email: ' A@B.COM ', senha: 'x' }), { email: 'a@b.com', senha: 'x' });
  assert.throws(
    () => validate(loginSchema, { email: 'invalido', senha: '' }),
    (error) => error instanceof HttpError && error.status === 400 && 'email' in error.fields,
  );
  assert.equal(badRequest('x').status, 400);
});

test('parseArguments separa posicionais e opções e exige valor', () => {
  const { options, positional } = parseArguments(['superadmin', 'criar', '--email', 'a@b.com']);
  assert.deepEqual(positional, ['superadmin', 'criar']);
  assert.equal(options.email, 'a@b.com');
  assert.throws(() => parseArguments(['--email']), /requer um valor/);
});

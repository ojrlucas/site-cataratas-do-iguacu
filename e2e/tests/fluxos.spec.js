const { test, expect } = require('@playwright/test');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const backend = path.resolve(__dirname, '..', '..', 'backend');
const dados = path.resolve(__dirname, '..', '.dados');
const sufixo = Date.now().toString(36);
const usuario = { nome: 'Maria Teste', email: `maria.${sufixo}@exemplo.com`, telefone: '45999990000', senha: 'senha-segura-1' };
const admin = { email: `admin.${sufixo}@exemplo.com`, senha: 'admin-seguro-1' };

function cli(...args) {
  return execFileSync('node', ['src/cli.js', ...args], { cwd: backend, env: { ...process.env, DATA_DIR: dados }, encoding: 'utf8' });
}

async function semRolagemHorizontal(page) {
  const excesso = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(excesso).toBeLessThanOrEqual(0);
}

test.describe.configure({ mode: 'serial' });

test('páginas públicas carregam sem erros e sem rolagem horizontal', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  for (const rota of ['/', '/sobre', '/lazer', '/ingressos', '/login', '/registre-se']) {
    await page.goto(rota);
    await page.waitForLoadState('networkidle');
    await semRolagemHorizontal(page);
  }
  expect(erros).toEqual([]);
});

test('lazer: cartão abre detalhes e fecha com Esc', async ({ page }) => {
  await page.goto('/lazer');
  await page.locator('.cartao button').first().click();
  await expect(page.locator('.modal-cartao')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.modal-cartao')).toHaveCount(0);
});

test('tema alterna, persiste e segue a preferência do sistema', async ({ page, browser }) => {
  await page.goto('/');
  const antes = await page.evaluate(() => document.documentElement.dataset.tema);
  if (page.viewportSize().width < 900) await page.locator('.nav-links > i').click();
  await page.locator('.tema-btn:visible').first().click();
  const depois = await page.evaluate(() => document.documentElement.dataset.tema);
  expect(depois).not.toBe(antes);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.dataset.tema)).toBe(depois);

  const contexto = await browser.newContext({ colorScheme: 'dark' });
  const escura = await contexto.newPage();
  await escura.goto('/');
  expect(await escura.evaluate(() => document.documentElement.dataset.tema)).toBe('escuro');
  await contexto.close();
});

test('cadastro, retorno ao destino, compra, QR Code e pedido listado', async ({ page }) => {
  await page.goto('/ingressos');
  await page.locator('.ingresso button').first().click();
  await expect(page).toHaveURL(/login\?returnUrl=%2Fingressos/);

  await page.getByRole('link', { name: 'Registre-se' }).last().click();
  await page.fill('#nome', usuario.nome);
  await page.fill('#email', usuario.email);
  await page.fill('#numero', usuario.telefone);
  await page.fill('#senha', usuario.senha);
  await page.fill('#confirmacao-senha', usuario.senha);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/ingressos$/);

  await page.locator('.ingresso button').first().click();
  await page.getByLabel('Aumentar quantidade').click();
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page.locator('.qr-bloco img')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.pedido')).toHaveCount(1);
  await semRolagemHorizontal(page);
});

test('senhas diferentes bloqueiam o cadastro', async ({ page }) => {
  await page.goto('/registre-se');
  await page.fill('#nome', 'Pessoa Teste');
  await page.fill('#email', `outra.${sufixo}@exemplo.com`);
  await page.fill('#numero', '45999990000');
  await page.fill('#senha', 'senha-segura-1');
  await page.fill('#confirmacao-senha', 'diferente-123');
  await page.click('button[type=submit]');
  await expect(page.getByText('As senhas não conferem.')).toBeVisible();
  await expect(page).toHaveURL(/registre-se/);
});

test('painel: usuário comum é barrado; superadmin acessa e gere conteúdo', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', usuario.email);
  await page.fill('#senha', usuario.senha);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/admin');
  await expect(page).toHaveURL(/login/);

  cli('superadmin', 'criar', '--email', admin.email, '--nome', 'Admin Teste', '--senha', admin.senha);
  await page.goto('/login');
  await page.fill('#email', admin.email);
  await page.fill('#senha', admin.senha);
  await page.click('button[type=submit]');
  await page.goto('/admin');
  await expect(page.locator('.metrica').first()).toBeVisible();
  await semRolagemHorizontal(page);

  for (const aba of ['Pedidos', 'Usuários', 'Ingressos', 'Lazer']) {
    await page.locator('.aba', { hasText: aba }).click();
    await semRolagemHorizontal(page);
  }
  await page.getByRole('button', { name: 'Nova atividade' }).click();
  await page.fill('#a-titulo', `Trilha ${sufixo}`);
  await page.fill('#a-desc', 'Caminhada guiada pela mata atlântica do parque.');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText(`Trilha ${sufixo}`).first()).toBeVisible();
});

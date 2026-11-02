import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { openDb } from './db.js';

const AJUDA = `Uso: node src/cli.js superadmin <comando> [opções]

Comandos:
  criar       --email <e> --nome <n> [--senha <s>] [--telefone <t>]   Cria um superadmin (ou promove usuário existente)
  atualizar   --email <e> [--nome <n>] [--novo-email <e>] [--senha <s>] [--telefone <t>]
  promover    --email <e>      Torna um usuário existente superadmin
  rebaixar    --email <e>      Remove o papel de superadmin
  listar                       Lista os superadmins

Se --senha for omitida, será solicitada de forma oculta (ou lida da entrada padrão).
Variável DATA_DIR define onde está o banco (padrão: ./data).`;

function parseArgs(argv) {
  const opts = {};
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      const v = argv[i + 1];
      if (v === undefined || v.startsWith('--')) throw new Error(`Opção --${k} requer um valor`);
      opts[k] = v;
      i++;
    } else pos.push(argv[i]);
  }
  return { opts, pos };
}

function pedirSenha(pergunta) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });
    if (process.stdin.isTTY) {
      rl._writeToOutput = (s) => { if (s.includes(pergunta)) process.stdout.write(s); };
    }
    rl.question(pergunta, (r) => { rl.close(); if (process.stdin.isTTY) process.stdout.write('\n'); resolve(r); });
  });
}

async function obterSenha(opts, confirmar) {
  let senha = opts.senha;
  if (senha === undefined) {
    senha = await pedirSenha('Senha: ');
    if (confirmar && process.stdin.isTTY && (await pedirSenha('Confirme a senha: ')) !== senha) throw new Error('As senhas não conferem');
  }
  if (senha.length < 8 || senha.length > 72) throw new Error('A senha deve ter entre 8 e 72 caracteres');
  return senha;
}

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const norm = (e) => String(e ?? '').trim().toLowerCase();

export async function run(argv, db, log = console.log) {
  const { opts, pos } = parseArgs(argv);
  const [grupo, cmd] = pos;
  if (grupo !== 'superadmin' || !cmd) { log(AJUDA); return grupo ? 1 : 0; }

  if (cmd === 'listar') {
    const rows = db.prepare("SELECT id,nome,email,criado_em FROM usuarios WHERE papel='superadmin' ORDER BY id").all();
    if (!rows.length) log('Nenhum superadmin cadastrado.');
    rows.forEach((r) => log(`#${r.id}  ${r.email}  (${r.nome})  criado em ${r.criado_em}`));
    return 0;
  }

  const email = norm(opts.email);
  if (!emailOk(email)) throw new Error('Informe um --email válido');
  const existente = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

  if (cmd === 'criar') {
    if (existente) {
      db.prepare("UPDATE usuarios SET papel='superadmin' WHERE id=?").run(existente.id);
      if (opts.senha !== undefined) db.prepare('UPDATE usuarios SET senha_hash=? WHERE id=?').run(bcrypt.hashSync(await obterSenha(opts), 12), existente.id);
      log(`Usuário existente ${email} promovido a superadmin.`);
      return 0;
    }
    if (!opts.nome || opts.nome.trim().length < 3) throw new Error('Informe --nome (mínimo 3 caracteres)');
    const hash = bcrypt.hashSync(await obterSenha(opts, true), 12);
    db.prepare("INSERT INTO usuarios (nome,email,telefone,senha_hash,papel) VALUES (?,?,?,?, 'superadmin')").run(opts.nome.trim(), email, opts.telefone ?? '', hash);
    log(`Superadmin ${email} criado.`);
    return 0;
  }

  if (!existente) throw new Error(`Usuário ${email} não encontrado`);

  if (cmd === 'promover') {
    db.prepare("UPDATE usuarios SET papel='superadmin' WHERE id=?").run(existente.id);
    log(`${email} agora é superadmin.`);
  } else if (cmd === 'rebaixar') {
    const n = db.prepare("SELECT COUNT(*) c FROM usuarios WHERE papel='superadmin'").get().c;
    if (existente.papel === 'superadmin' && n <= 1 && !('forcar' in opts)) throw new Error('Este é o único superadmin. Use --forcar sim para rebaixar mesmo assim.');
    db.prepare("UPDATE usuarios SET papel='usuario' WHERE id=?").run(existente.id);
    log(`${email} não é mais superadmin.`);
  } else if (cmd === 'atualizar') {
    if (existente.papel !== 'superadmin') throw new Error(`${email} não é superadmin (use "promover" antes)`);
    const upd = {};
    if (opts.nome) upd.nome = opts.nome.trim();
    if (opts.telefone !== undefined) upd.telefone = opts.telefone;
    if (opts['novo-email']) {
      const ne = norm(opts['novo-email']);
      if (!emailOk(ne)) throw new Error('--novo-email inválido');
      if (db.prepare('SELECT 1 FROM usuarios WHERE email=? AND id<>?').get(ne, existente.id)) throw new Error('Já existe usuário com o novo e-mail');
      upd.email = ne;
    }
    if (opts.senha !== undefined || (!Object.keys(upd).length)) upd.senha_hash = bcrypt.hashSync(await obterSenha(opts, true), 12);
    const cols = Object.keys(upd);
    db.prepare(`UPDATE usuarios SET ${cols.map((c) => `${c}=?`).join(',')} WHERE id=?`).run(...cols.map((c) => upd[c]), existente.id);
    log(`Superadmin ${email} atualizado (${cols.map((c) => (c === 'senha_hash' ? 'senha' : c)).join(', ')}).`);
  } else {
    log(AJUDA);
    return 1;
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const dataDir = process.env.DATA_DIR || path.join(here, '..', 'data');
  const db = openDb(path.join(dataDir, 'cataratas.db'));
  run(process.argv.slice(2), db).then((c) => process.exit(c), (e) => { console.error('Erro: ' + e.message); process.exit(1); });
}

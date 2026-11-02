import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { parque } from './data.js';

const registroSchema = z
  .object({
    nome: z.string().trim().min(3, 'Informe o nome completo'),
    email: z.string().trim().toLowerCase().email('E-mail inválido'),
    telefone: z.string().trim().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos (com DDD)'),
    senha: z.string().min(8, 'A senha deve ter ao menos 8 caracteres').max(72, 'A senha deve ter no máximo 72 caracteres'),
    confirmacaoSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmacaoSenha, { message: 'As senhas não conferem', path: ['confirmacaoSenha'] });

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  senha: z.string().min(1, 'Informe a senha').max(72, 'Senha inválida'),
});

const pedidoSchema = z.object({
  tipoId: z.string(),
  quantidade: z.number().int().min(1, 'Mínimo 1 ingresso').max(10, 'Máximo 10 ingressos por pedido'),
  dataVisita: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
});

const BCRYPT_COST = 12;
const HASH_FALSO = bcrypt.hashSync('senha-inexistente', BCRYPT_COST);

class HttpError extends Error {
  constructor(status, message, campos) {
    super(message);
    this.status = status;
    this.campos = campos;
  }
}

export function createApp({ db, jwtSecret, staticDir, mailer, rateLimitMax = 300 }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({
    referrerPolicy: { policy: 'no-referrer' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        frameSrc: ['https://www.google.com'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
      },
    },
  }));
  app.use(cors());
  app.use(express.json({ limit: '50kb' }));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: rateLimitMax, standardHeaders: true, legacyHeaders: false }));

  const assinar = (u) => jwt.sign({ sub: u.id }, jwtSecret, { algorithm: 'HS256', expiresIn: '7d' });
  const publico = (u) => ({ id: u.id, nome: u.nome, email: u.email, telefone: u.telefone, papel: u.papel });
  const validar = (schema, body) => {
    const r = schema.safeParse(body);
    if (!r.success) {
      const campos = {};
      for (const i of r.error.issues) campos[i.path.join('.') || '_'] ??= i.message;
      throw new HttpError(400, Object.values(campos)[0], campos);
    }
    return r.data;
  };

  const auth = (req, _res, next) => {
    try {
      const h = req.headers.authorization || '';
      const token = h.startsWith('Bearer ') ? h.slice(7) : null;
      if (!token) throw new Error();
      const { sub } = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
      const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(sub);
      if (!u) throw new Error();
      req.usuario = u;
      next();
    } catch {
      next(new HttpError(401, 'Sessão inválida ou expirada. Faça login novamente.'));
    }
  };

  const authLimiter = rateLimit({ windowMs: 15 * 60_000, limit: Math.max(rateLimitMax / 6, 20), standardHeaders: true, legacyHeaders: false, message: { erro: 'Muitas tentativas. Tente novamente mais tarde.' } });

  const api = express.Router();
  api.get('/health', (_req, res) => res.json({ status: 'ok' }));
  api.get('/parque', (_req, res) => res.json(parque));
  const fmtAtividade = (a) => ({ id: a.id, titulo: a.titulo, imagem: a.imagem, alt: a.alt, descricao: a.descricao });
  const fmtTipo = (t) => ({ id: t.id, nome: t.nome, precoCentavos: t.preco_centavos, imagem: t.imagem, descricao: t.descricao, ativo: !!t.ativo });
  api.get('/atividades', (_req, res) => res.json(db.prepare('SELECT * FROM atividades ORDER BY ordem, rowid').all().map(fmtAtividade)));
  api.get('/ingressos/tipos', (_req, res) => res.json(db.prepare('SELECT * FROM tipos_ingresso WHERE ativo = 1 ORDER BY preco_centavos DESC').all().map(fmtTipo)));

  api.post('/auth/registro', authLimiter, (req, res) => {
    const d = validar(registroSchema, req.body);
    if (db.prepare('SELECT 1 FROM usuarios WHERE email = ?').get(d.email))
      throw new HttpError(409, 'Já existe uma conta com este e-mail', { email: 'E-mail já cadastrado' });
    const hash = bcrypt.hashSync(d.senha, BCRYPT_COST);
    const r = db.prepare('INSERT INTO usuarios (nome, email, telefone, senha_hash) VALUES (?,?,?,?)').run(d.nome, d.email, d.telefone, hash);
    const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(r.lastInsertRowid);
    res.status(201).json({ token: assinar(u), usuario: publico(u) });
  });

  api.post('/auth/login', authLimiter, (req, res) => {
    const d = validar(loginSchema, req.body);
    const u = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(d.email);
    const hashAlvo = u ? u.senha_hash : HASH_FALSO;
    const confere = bcrypt.compareSync(d.senha, hashAlvo);
    if (!u || !confere) throw new HttpError(401, 'E-mail ou senha incorretos');
    res.json({ token: assinar(u), usuario: publico(u) });
  });

  api.post('/auth/esqueci-senha', authLimiter, (req, res) => {
    validar(z.object({ email: z.string().trim().email('E-mail inválido') }), req.body);
    res.json({ mensagem: 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.' });
  });

  api.get('/auth/me', auth, (req, res) => res.json(publico(req.usuario)));

  const formatarPedido = (p) => ({ id: p.id, codigo: p.codigo, tipoId: p.tipo_id, tipoNome: p.tipo_nome, quantidade: p.quantidade,
    dataVisita: p.data_visita, totalCentavos: p.total_centavos, emailEnviado: !!p.email_enviado, criadoEm: p.criado_em });

  const gerarQr = (p) => QRCode.toBuffer(`${p.codigo}|${p.tipo_id}|${p.quantidade}|${p.data_visita}`, { margin: 1, width: 300 });
  async function enviarEmail(pedidoRow, usuario) {
    if (!mailer) return false;
    try {
      await mailer.enviarComprovante({ pedido: formatarPedido(pedidoRow), usuario, qrPng: await gerarQr(pedidoRow) });
      db.prepare('UPDATE pedidos SET email_enviado = 1 WHERE id = ?').run(pedidoRow.id);
      return true;
    } catch (e) {
      console.error('Falha ao enviar e-mail do pedido', pedidoRow.codigo, e.message);
      return false;
    }
  }
  const hojeStr = () => new Date().toISOString().slice(0, 10);

  api.post('/pedidos', auth, async (req, res) => {
    const d = validar(pedidoSchema, req.body);
    const tipo = db.prepare('SELECT * FROM tipos_ingresso WHERE id = ? AND ativo = 1').get(d.tipoId);
    if (!tipo) throw new HttpError(400, 'Tipo de ingresso inexistente', { tipoId: 'Tipo inexistente' });
    const ontem = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    if (d.dataVisita < ontem || Number.isNaN(Date.parse(d.dataVisita)))
      throw new HttpError(400, 'A data da visita não pode estar no passado', { dataVisita: 'Data no passado' });
    const codigo = 'CPI-' + crypto.randomBytes(5).toString('hex').toUpperCase();
    const r = db.prepare('INSERT INTO pedidos (codigo, usuario_id, tipo_id, tipo_nome, quantidade, data_visita, total_centavos) VALUES (?,?,?,?,?,?,?)')
      .run(codigo, req.usuario.id, tipo.id, tipo.nome, d.quantidade, d.dataVisita, tipo.preco_centavos * d.quantidade);
    const row = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(r.lastInsertRowid);
    await enviarEmail(row, req.usuario);
    res.status(201).json(formatarPedido(db.prepare('SELECT * FROM pedidos WHERE id = ?').get(row.id)));
  });

  api.get('/pedidos', auth, (req, res) => {
    res.json(db.prepare('SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY id DESC').all(req.usuario.id).map(formatarPedido));
  });

  const meuPedido = (req) => {
    const p = db.prepare('SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?').get(Number(req.params.id), req.usuario.id);
    if (!p) throw new HttpError(404, 'Pedido não encontrado');
    return p;
  };

  api.get('/pedidos/:id/qrcode', auth, async (req, res) => {
    const p = meuPedido(req);
    res.json({ ...formatarPedido(p), qrcode: 'data:image/png;base64,' + (await gerarQr(p)).toString('base64') });
  });

  api.post('/pedidos/:id/reenviar', auth, async (req, res) => {
    const p = meuPedido(req);
    const ok = await enviarEmail(p, req.usuario);
    if (!ok) throw new HttpError(502, 'Não foi possível enviar o e-mail agora. Tente novamente mais tarde.');
    res.json({ mensagem: `Comprovante enviado para ${req.usuario.email}` });
  });

  const admin = express.Router();
  admin.use(auth, (req, _res, next) =>
    req.usuario.papel === 'superadmin' ? next() : next(new HttpError(403, 'Acesso restrito a superadmins')));

  admin.get('/resumo', (_req, res) => {
    const q = (sql) => db.prepare(sql).get();
    res.json({
      usuarios: q("SELECT COUNT(*) c FROM usuarios").c,
      pedidos: q('SELECT COUNT(*) c FROM pedidos').c,
      ingressos: q('SELECT COALESCE(SUM(quantidade),0) c FROM pedidos').c,
      receitaCentavos: q('SELECT COALESCE(SUM(total_centavos),0) c FROM pedidos').c,
      hoje: db.prepare('SELECT COUNT(*) c FROM pedidos WHERE date(criado_em) = ?').get(hojeStr()).c,
    });
  });

  admin.get('/pedidos', (_req, res) => {
    const rows = db.prepare(`SELECT p.*, u.nome usuario_nome, u.email usuario_email FROM pedidos p JOIN usuarios u ON u.id = p.usuario_id ORDER BY p.id DESC LIMIT 500`).all();
    res.json(rows.map((p) => ({ ...formatarPedido(p), usuarioNome: p.usuario_nome, usuarioEmail: p.usuario_email })));
  });

  admin.get('/usuarios', (_req, res) => {
    const rows = db.prepare(`SELECT u.*, (SELECT COUNT(*) FROM pedidos WHERE usuario_id = u.id) pedidos FROM usuarios u ORDER BY u.id DESC`).all();
    res.json(rows.map((u) => ({ ...publico(u), criadoEm: u.criado_em, pedidos: u.pedidos })));
  });

  admin.patch('/usuarios/:id', (req, res) => {
    const { papel } = validar(z.object({ papel: z.enum(['usuario', 'superadmin']) }), req.body);
    const id = Number(req.params.id);
    if (id === req.usuario.id) throw new HttpError(400, 'Você não pode alterar o próprio papel');
    if (!db.prepare('SELECT 1 FROM usuarios WHERE id = ?').get(id)) throw new HttpError(404, 'Usuário não encontrado');
    db.prepare('UPDATE usuarios SET papel = ? WHERE id = ?').run(papel, id);
    res.json(publico(db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id)));
  });

  const imagemSchema = z.string().regex(/^imagens\/[\w.-]+$/, 'Imagem inválida');
  const tipoSchema = z.object({
    nome: z.string().trim().min(2, 'Informe o nome').max(60),
    precoCentavos: z.number().int().min(0, 'Preço inválido').max(1_000_000),
    descricao: z.string().trim().min(5, 'Informe a descrição').max(600),
    imagem: imagemSchema,
    ativo: z.boolean().default(true),
  });
  const atividadeSchema = z.object({
    titulo: z.string().trim().min(2, 'Informe o título').max(60),
    descricao: z.string().trim().min(10, 'Informe a descrição').max(1500),
    imagem: imagemSchema,
    alt: z.string().trim().min(2).max(120).optional(),
  });
  const slug = (txt, existe) => {
    const base = txt.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
    let id = base, n = 2;
    while (existe(id)) id = `${base}-${n++}`;
    return id;
  };

  admin.get('/tipos', (_req, res) => res.json(db.prepare('SELECT * FROM tipos_ingresso ORDER BY preco_centavos DESC').all().map(fmtTipo)));
  admin.post('/tipos', (req, res) => {
    const d = validar(tipoSchema, req.body);
    const id = slug(d.nome, (i) => db.prepare('SELECT 1 FROM tipos_ingresso WHERE id = ?').get(i));
    db.prepare('INSERT INTO tipos_ingresso (id,nome,preco_centavos,imagem,descricao,ativo) VALUES (?,?,?,?,?,?)').run(id, d.nome, d.precoCentavos, d.imagem, d.descricao, d.ativo ? 1 : 0);
    res.status(201).json(fmtTipo(db.prepare('SELECT * FROM tipos_ingresso WHERE id = ?').get(id)));
  });
  admin.put('/tipos/:id', (req, res) => {
    const d = validar(tipoSchema, req.body);
    const r = db.prepare('UPDATE tipos_ingresso SET nome=?, preco_centavos=?, imagem=?, descricao=?, ativo=? WHERE id=?').run(d.nome, d.precoCentavos, d.imagem, d.descricao, d.ativo ? 1 : 0, req.params.id);
    if (!r.changes) throw new HttpError(404, 'Tipo não encontrado');
    res.json(fmtTipo(db.prepare('SELECT * FROM tipos_ingresso WHERE id = ?').get(req.params.id)));
  });

  admin.post('/atividades', (req, res) => {
    const d = validar(atividadeSchema, req.body);
    const id = slug(d.titulo, (i) => db.prepare('SELECT 1 FROM atividades WHERE id = ?').get(i));
    const ordem = db.prepare('SELECT COALESCE(MAX(ordem),-1)+1 o FROM atividades').get().o;
    db.prepare('INSERT INTO atividades (id,titulo,imagem,alt,descricao,ordem) VALUES (?,?,?,?,?,?)').run(id, d.titulo, d.imagem, d.alt ?? d.titulo, d.descricao, ordem);
    res.status(201).json(fmtAtividade(db.prepare('SELECT * FROM atividades WHERE id = ?').get(id)));
  });
  admin.put('/atividades/:id', (req, res) => {
    const d = validar(atividadeSchema, req.body);
    const r = db.prepare('UPDATE atividades SET titulo=?, imagem=?, alt=?, descricao=? WHERE id=?').run(d.titulo, d.imagem, d.alt ?? d.titulo, d.descricao, req.params.id);
    if (!r.changes) throw new HttpError(404, 'Atividade não encontrada');
    res.json(fmtAtividade(db.prepare('SELECT * FROM atividades WHERE id = ?').get(req.params.id)));
  });
  admin.delete('/atividades/:id', (req, res) => {
    const r = db.prepare('DELETE FROM atividades WHERE id = ?').run(req.params.id);
    if (!r.changes) throw new HttpError(404, 'Atividade não encontrada');
    res.status(204).end();
  });

  api.use('/admin', admin);

  app.use('/api', api);
  app.use('/api', (_req, _res, next) => next(new HttpError(404, 'Rota não encontrada')));

  if (staticDir && fs.existsSync(staticDir)) {
    app.use(express.static(staticDir, { index: false, maxAge: '1h' }));
    app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.resolve(staticDir, 'index.html')));
  }

  app.use((err, _req, res, _next) => {
    if (err instanceof HttpError) return res.status(err.status).json({ erro: err.message, campos: err.campos });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  });

  return app;
}

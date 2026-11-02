import nodemailer from 'nodemailer';
import { formatBrl, formatDateBr, renderComprovanteHtml } from './comprovante-template.js';

const DEFAULT_FROM = 'Cataratas do Iguaçu <nao-responda@catarataspni.com.br>';
const DEFAULT_PUBLIC_URL = 'http://localhost:8080';
const DEFAULT_SMTP_PORT = 587;
const TIMEOUTS = { connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 15000 };

function buildTransport(env) {
  if (!env.SMTP_HOST) {
    console.warn('[aviso] SMTP_HOST não definido: e-mails serão apenas registrados no log.');
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || DEFAULT_SMTP_PORT,
    secure: env.SMTP_SECURE === 'true',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    ...TIMEOUTS,
  });
}

const buildSubject = (pedido) => `Seu ingresso - Parque Nacional do Iguaçu (${pedido.codigo})`;

const buildPlainText = (pedido, usuario) =>
  `Olá, ${usuario.nome}! Pedido ${pedido.codigo}: ${pedido.quantidade}x ${pedido.tipoNome} para ${formatDateBr(pedido.dataVisita)}. Total ${formatBrl(pedido.totalCentavos)}.`;

export function createMailer(env = process.env) {
  const transport = buildTransport(env);
  const from = env.MAIL_FROM || DEFAULT_FROM;
  const publicUrl = env.PUBLIC_URL || DEFAULT_PUBLIC_URL;
  const simulated = !env.SMTP_HOST;

  return {
    async enviarComprovante({ pedido, usuario, qrPng }) {
      const info = await transport.sendMail({
        from,
        to: usuario.email,
        subject: buildSubject(pedido),
        text: buildPlainText(pedido, usuario),
        html: renderComprovanteHtml({ pedido, usuario, publicUrl }),
        attachments: [{ filename: 'qrcode.png', content: qrPng, cid: 'qrcode', contentType: 'image/png' }],
      });
      if (simulated) console.log(`[email simulado] para ${usuario.email}: ${pedido.codigo}`);
      return info;
    },
  };
}

import nodemailer from 'nodemailer';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const brl = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBr = (d) => d.split('-').reverse().join('/');

export function htmlComprovante({ pedido, usuario, publicUrl }) {
  return `<!doctype html><html lang="pt-br"><body style="margin:0;background:#E5E5E5;font-family:Arial,Helvetica,sans-serif;color:#222">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
    <table role="presentation" width="560" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden">
      <tr><td style="background:#006ca6;color:#fff;padding:24px;text-align:center">
        <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase">Parque Nacional do Iguaçu</div>
        <div style="font-size:24px;font-weight:bold;margin-top:6px">Comprovante de ingresso</div>
      </td></tr>
      <tr><td style="padding:24px">
        <p style="margin:0 0 16px">Olá, <strong>${esc(usuario.nome)}</strong>! Seu pedido foi confirmado. Apresente o QR Code abaixo na entrada do parque.</p>
        <table role="presentation" width="100%" style="background:#f2f7fb;border-radius:10px;padding:14px;font-size:14px">
          <tr><td style="padding:4px 12px">Pedido</td><td align="right" style="padding:4px 12px"><strong>${esc(pedido.codigo)}</strong></td></tr>
          <tr><td style="padding:4px 12px">Ingresso</td><td align="right" style="padding:4px 12px">${esc(pedido.quantidade)}x ${esc(pedido.tipoNome)}</td></tr>
          <tr><td style="padding:4px 12px">Data da visita</td><td align="right" style="padding:4px 12px">${esc(dataBr(pedido.dataVisita))}</td></tr>
          <tr><td style="padding:4px 12px">Total</td><td align="right" style="padding:4px 12px"><strong>${esc(brl(pedido.totalCentavos))}</strong></td></tr>
        </table>
        <div style="text-align:center;margin:24px 0"><img src="cid:qrcode" width="220" height="220" alt="QR Code do ingresso" style="border:8px solid #fff;outline:1px solid #ddd"></div>
        <p style="font-size:13px;color:#555;margin:0">Meia-entrada: leve um documento que comprove o direito ao benefício. O parque abre todos os dias; confira os horários em <a href="${esc(publicUrl)}" style="color:#006ca6">nosso site</a>.</p>
      </td></tr>
      <tr><td style="background:#015b8c;color:#fff;font-size:12px;text-align:center;padding:14px">Feito para fins de estudo (não oficial) · Valores fictícios</td></tr>
    </table>
  </td></tr></table></body></html>`;
}

export function createMailer(env = process.env) {
  const host = env.SMTP_HOST;
  const from = env.MAIL_FROM || 'Cataratas do Iguaçu <nao-responda@catarataspni.com.br>';
  const publicUrl = env.PUBLIC_URL || 'http://localhost:8080';
  const transport = host
    ? nodemailer.createTransport({
        host,
        port: Number(env.SMTP_PORT) || 587,
        secure: env.SMTP_SECURE === 'true',
        auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 15000,
      })
    : nodemailer.createTransport({ jsonTransport: true });
  if (!host) console.warn('[aviso] SMTP_HOST não definido: e-mails serão apenas registrados no log.');

  return {
    async enviarComprovante({ pedido, usuario, qrPng }) {
      const info = await transport.sendMail({
        from,
        to: usuario.email,
        subject: `Seu ingresso - Parque Nacional do Iguaçu (${pedido.codigo})`,
        text: `Olá, ${usuario.nome}! Pedido ${pedido.codigo}: ${pedido.quantidade}x ${pedido.tipoNome} para ${dataBr(pedido.dataVisita)}. Total ${brl(pedido.totalCentavos)}.`,
        html: htmlComprovante({ pedido, usuario, publicUrl }),
        attachments: [{ filename: 'qrcode.png', content: qrPng, cid: 'qrcode', contentType: 'image/png' }],
      });
      if (!host) console.log(`[email simulado] para ${usuario.email}: ${pedido.codigo}`);
      return info;
    },
  };
}

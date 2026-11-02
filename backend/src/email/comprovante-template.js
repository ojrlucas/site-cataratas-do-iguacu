const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const formatBrl = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatDateBr = (isoDate) => isoDate.split('-').reverse().join('/');

export function renderComprovanteHtml({ pedido, usuario, publicUrl }) {
  return `<!doctype html><html lang="pt-br"><body style="margin:0;background:#E5E5E5;font-family:Arial,Helvetica,sans-serif;color:#222">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
    <table role="presentation" width="560" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden">
      <tr><td style="background:#006ca6;color:#fff;padding:24px;text-align:center">
        <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase">Parque Nacional do Iguaçu</div>
        <div style="font-size:24px;font-weight:bold;margin-top:6px">Comprovante de ingresso</div>
      </td></tr>
      <tr><td style="padding:24px">
        <p style="margin:0 0 16px">Olá, <strong>${escapeHtml(usuario.nome)}</strong>! Seu pedido foi confirmado. Apresente o QR Code abaixo na entrada do parque.</p>
        <table role="presentation" width="100%" style="background:#f2f7fb;border-radius:10px;padding:14px;font-size:14px">
          <tr><td style="padding:4px 12px">Pedido</td><td align="right" style="padding:4px 12px"><strong>${escapeHtml(pedido.codigo)}</strong></td></tr>
          <tr><td style="padding:4px 12px">Ingresso</td><td align="right" style="padding:4px 12px">${escapeHtml(pedido.quantidade)}x ${escapeHtml(pedido.tipoNome)}</td></tr>
          <tr><td style="padding:4px 12px">Data da visita</td><td align="right" style="padding:4px 12px">${escapeHtml(formatDateBr(pedido.dataVisita))}</td></tr>
          <tr><td style="padding:4px 12px">Total</td><td align="right" style="padding:4px 12px"><strong>${escapeHtml(formatBrl(pedido.totalCentavos))}</strong></td></tr>
        </table>
        <div style="text-align:center;margin:24px 0"><img src="cid:qrcode" width="220" height="220" alt="QR Code do ingresso" style="border:8px solid #fff;outline:1px solid #ddd"></div>
        <p style="font-size:13px;color:#555;margin:0">Meia-entrada: leve um documento que comprove o direito ao benefício. O parque abre todos os dias; confira os horários em <a href="${escapeHtml(publicUrl)}" style="color:#006ca6">nosso site</a>.</p>
      </td></tr>
      <tr><td style="background:#015b8c;color:#fff;font-size:12px;text-align:center;padding:14px">Feito para fins de estudo (não oficial) · Valores fictícios</td></tr>
    </table>
  </td></tr></table></body></html>`;
}

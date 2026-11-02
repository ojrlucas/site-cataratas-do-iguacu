import QRCode from 'qrcode';
import { QR_CODE_WIDTH } from '../config/constants.js';

const payloadOf = (pedido) => `${pedido.codigo}|${pedido.tipo_id}|${pedido.quantidade}|${pedido.data_visita}`;

export function createQrCodeService() {
  const toPng = (pedido) => QRCode.toBuffer(payloadOf(pedido), { margin: 1, width: QR_CODE_WIDTH });

  return {
    toPng,
    async toDataUrl(pedido) {
      const png = await toPng(pedido);
      return `data:image/png;base64,${png.toString('base64')}`;
    },
  };
}

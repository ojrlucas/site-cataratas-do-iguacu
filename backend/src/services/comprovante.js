import { serializePedido } from '../serializers/pedido.js';

export function createComprovanteService({ mailer, pedidos, qrCode, logger = console }) {
  return {
    async send(pedido, usuario) {
      if (!mailer) return false;
      try {
        await mailer.enviarComprovante({
          pedido: serializePedido(pedido),
          usuario,
          qrPng: await qrCode.toPng(pedido),
        });
        pedidos.markEmailSent(pedido.id);
        return true;
      } catch (error) {
        logger.error('Falha ao enviar e-mail do pedido', pedido.codigo, error.message);
        return false;
      }
    },
  };
}

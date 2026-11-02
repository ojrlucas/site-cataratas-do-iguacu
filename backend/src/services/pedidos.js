import { badGateway, badRequest, notFound } from '../shared/http-error.js';
import { isValidDate, yesterday } from '../shared/dates.js';
import { serializePedido } from '../serializers/pedido.js';
import { generateOrderCode } from './order-code.js';

export function createPedidosService({ pedidos, tiposIngresso, comprovante, qrCode }) {
  const findOwned = (usuario, id) => {
    const pedido = pedidos.findByIdAndUser(Number(id), usuario.id);
    if (!pedido) throw notFound('Pedido não encontrado');
    return pedido;
  };

  const assertVisitDate = (dataVisita) => {
    if (dataVisita < yesterday() || !isValidDate(dataVisita)) {
      throw badRequest('A data da visita não pode estar no passado', { dataVisita: 'Data no passado' });
    }
  };

  return {
    async create(usuario, { tipoId, quantidade, dataVisita }) {
      const tipo = tiposIngresso.findActiveById(tipoId);
      if (!tipo) throw badRequest('Tipo de ingresso inexistente', { tipoId: 'Tipo inexistente' });
      assertVisitDate(dataVisita);
      const created = pedidos.insert({
        codigo: generateOrderCode(),
        usuarioId: usuario.id,
        tipoId: tipo.id,
        tipoNome: tipo.nome,
        quantidade,
        dataVisita,
        totalCentavos: tipo.preco_centavos * quantidade,
      });
      await comprovante.send(created, usuario);
      return serializePedido(pedidos.findById(created.id));
    },

    listFor: (usuario) => pedidos.listByUser(usuario.id).map(serializePedido),

    async getWithQrCode(usuario, id) {
      const pedido = findOwned(usuario, id);
      return { ...serializePedido(pedido), qrcode: await qrCode.toDataUrl(pedido) };
    },

    async resendReceipt(usuario, id) {
      const pedido = findOwned(usuario, id);
      if (!(await comprovante.send(pedido, usuario))) {
        throw badGateway('Não foi possível enviar o e-mail agora. Tente novamente mais tarde.');
      }
      return { mensagem: `Comprovante enviado para ${usuario.email}` };
    },
  };
}

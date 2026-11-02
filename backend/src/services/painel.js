import { MAX_ADMIN_ORDERS } from '../config/constants.js';
import { badRequest, notFound } from '../shared/http-error.js';
import { today } from '../shared/dates.js';
import { serializePedidoAdmin } from '../serializers/pedido.js';
import { serializeUsuario, serializeUsuarioAdmin } from '../serializers/usuario.js';

export function createPainelService({ usuarios, pedidos, estatisticas }) {
  return {
    summary: () => estatisticas.summary(today()),
    listOrders: () => pedidos.listAllWithUser(MAX_ADMIN_ORDERS).map(serializePedidoAdmin),
    listUsers: () => usuarios.listWithOrderCount().map(serializeUsuarioAdmin),

    changeRole(actor, id, role) {
      if (id === actor.id) throw badRequest('Você não pode alterar o próprio papel');
      if (!usuarios.findById(id)) throw notFound('Usuário não encontrado');
      usuarios.setRole(id, role);
      return serializeUsuario(usuarios.findById(id));
    },
  };
}

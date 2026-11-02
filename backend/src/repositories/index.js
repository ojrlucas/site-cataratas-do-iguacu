import { createAtividadesRepository } from './atividades.js';
import { createEstatisticasRepository } from './estatisticas.js';
import { createPedidosRepository } from './pedidos.js';
import { createTiposIngressoRepository } from './tipos-ingresso.js';
import { createUsuariosRepository } from './usuarios.js';

export function createRepositories(db) {
  return {
    usuarios: createUsuariosRepository(db),
    pedidos: createPedidosRepository(db),
    tiposIngresso: createTiposIngressoRepository(db),
    atividades: createAtividadesRepository(db),
    estatisticas: createEstatisticasRepository(db),
  };
}

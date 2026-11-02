import { serializeAtividade, serializeTipo } from '../serializers/catalogo.js';

export function createCatalogoService({ atividades, tiposIngresso }) {
  return {
    listActivities: () => atividades.list().map(serializeAtividade),
    listActiveTicketTypes: () => tiposIngresso.listActive().map(serializeTipo),
  };
}

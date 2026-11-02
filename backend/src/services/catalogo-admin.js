import { notFound } from '../shared/http-error.js';
import { uniqueSlug } from '../shared/slug.js';
import { serializeAtividade, serializeTipo } from '../serializers/catalogo.js';

export function createCatalogoAdminService({ atividades, tiposIngresso }) {
  const ensure = (entity, message) => {
    if (!entity) throw notFound(message);
    return entity;
  };

  return {
    listTicketTypes: () => tiposIngresso.listAll().map(serializeTipo),

    createTicketType(dados) {
      const id = uniqueSlug(dados.nome, tiposIngresso.exists);
      return serializeTipo(tiposIngresso.insert({ id, ...dados }));
    },

    updateTicketType: (id, dados) => serializeTipo(ensure(tiposIngresso.update(id, dados), 'Tipo não encontrado')),

    createActivity(dados) {
      const id = uniqueSlug(dados.titulo, atividades.exists);
      const created = atividades.insert({ id, ...dados, alt: dados.alt ?? dados.titulo, ordem: atividades.nextOrder() });
      return serializeAtividade(created);
    },

    updateActivity(id, dados) {
      const updated = atividades.update(id, { ...dados, alt: dados.alt ?? dados.titulo });
      return serializeAtividade(ensure(updated, 'Atividade não encontrada'));
    },

    removeActivity(id) {
      ensure(atividades.remove(id), 'Atividade não encontrada');
    },
  };
}

import { atividades, tiposIngresso } from '../content/initial-content.js';

const isEmpty = (db, table) => db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get().total === 0;

function seedTicketTypes(db) {
  const insert = db.prepare('INSERT INTO tipos_ingresso (id, nome, preco_centavos, imagem, descricao) VALUES (?, ?, ?, ?, ?)');
  for (const tipo of tiposIngresso) insert.run(tipo.id, tipo.nome, tipo.precoCentavos, tipo.imagem, tipo.descricao);
}

function seedActivities(db) {
  const insert = db.prepare('INSERT INTO atividades (id, titulo, imagem, alt, descricao, ordem) VALUES (?, ?, ?, ?, ?, ?)');
  atividades.forEach((atividade, ordem) =>
    insert.run(atividade.id, atividade.titulo, atividade.imagem, atividade.alt, atividade.descricao, ordem));
}

export function seedDatabase(db) {
  if (isEmpty(db, 'tipos_ingresso')) seedTicketTypes(db);
  if (isEmpty(db, 'atividades')) seedActivities(db);
}

export function createTiposIngressoRepository(db) {
  const byId = db.prepare('SELECT * FROM tipos_ingresso WHERE id = ?');

  return {
    findById: (id) => byId.get(id),
    findActiveById: (id) => db.prepare('SELECT * FROM tipos_ingresso WHERE id = ? AND ativo = 1').get(id),
    exists: (id) => Boolean(db.prepare('SELECT 1 FROM tipos_ingresso WHERE id = ?').get(id)),
    listActive: () => db.prepare('SELECT * FROM tipos_ingresso WHERE ativo = 1 ORDER BY preco_centavos DESC').all(),
    listAll: () => db.prepare('SELECT * FROM tipos_ingresso ORDER BY preco_centavos DESC').all(),
    insert({ id, nome, precoCentavos, imagem, descricao, ativo }) {
      db.prepare('INSERT INTO tipos_ingresso (id, nome, preco_centavos, imagem, descricao, ativo) VALUES (?, ?, ?, ?, ?, ?)').run(
        id, nome, precoCentavos, imagem, descricao, ativo ? 1 : 0,
      );
      return byId.get(id);
    },
    update(id, { nome, precoCentavos, imagem, descricao, ativo }) {
      const result = db
        .prepare('UPDATE tipos_ingresso SET nome = ?, preco_centavos = ?, imagem = ?, descricao = ?, ativo = ? WHERE id = ?')
        .run(nome, precoCentavos, imagem, descricao, ativo ? 1 : 0, id);
      return result.changes ? byId.get(id) : undefined;
    },
  };
}

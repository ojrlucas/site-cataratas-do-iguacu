export function createAtividadesRepository(db) {
  const byId = db.prepare('SELECT * FROM atividades WHERE id = ?');

  return {
    list: () => db.prepare('SELECT * FROM atividades ORDER BY ordem, rowid').all(),
    exists: (id) => Boolean(byId.get(id)),
    nextOrder: () => db.prepare('SELECT COALESCE(MAX(ordem), -1) + 1 AS proxima FROM atividades').get().proxima,
    insert({ id, titulo, imagem, alt, descricao, ordem }) {
      db.prepare('INSERT INTO atividades (id, titulo, imagem, alt, descricao, ordem) VALUES (?, ?, ?, ?, ?, ?)').run(
        id, titulo, imagem, alt, descricao, ordem,
      );
      return byId.get(id);
    },
    update(id, { titulo, imagem, alt, descricao }) {
      const result = db
        .prepare('UPDATE atividades SET titulo = ?, imagem = ?, alt = ?, descricao = ? WHERE id = ?')
        .run(titulo, imagem, alt, descricao, id);
      return result.changes ? byId.get(id) : undefined;
    },
    remove: (id) => db.prepare('DELETE FROM atividades WHERE id = ?').run(id).changes > 0,
  };
}

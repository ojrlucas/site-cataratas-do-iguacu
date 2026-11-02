export function createPedidosRepository(db) {
  const byId = db.prepare('SELECT * FROM pedidos WHERE id = ?');

  return {
    findById: (id) => byId.get(id),
    findByIdAndUser: (id, usuarioId) => db.prepare('SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?').get(id, usuarioId),
    listByUser: (usuarioId) => db.prepare('SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY id DESC').all(usuarioId),
    listAllWithUser: (limit) =>
      db
        .prepare(
          `SELECT p.*, u.nome AS usuario_nome, u.email AS usuario_email
             FROM pedidos p JOIN usuarios u ON u.id = p.usuario_id
            ORDER BY p.id DESC LIMIT ?`,
        )
        .all(limit),
    insert({ codigo, usuarioId, tipoId, tipoNome, quantidade, dataVisita, totalCentavos }) {
      const result = db
        .prepare(
          `INSERT INTO pedidos (codigo, usuario_id, tipo_id, tipo_nome, quantidade, data_visita, total_centavos)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(codigo, usuarioId, tipoId, tipoNome, quantidade, dataVisita, totalCentavos);
      return byId.get(result.lastInsertRowid);
    },
    markEmailSent: (id) => db.prepare('UPDATE pedidos SET email_enviado = 1 WHERE id = ?').run(id),
  };
}

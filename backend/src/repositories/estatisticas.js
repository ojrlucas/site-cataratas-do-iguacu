export function createEstatisticasRepository(db) {
  const scalar = (sql, ...params) => db.prepare(sql).get(...params).total;

  return {
    summary: (date) => ({
      usuarios: scalar('SELECT COUNT(*) AS total FROM usuarios'),
      pedidos: scalar('SELECT COUNT(*) AS total FROM pedidos'),
      ingressos: scalar('SELECT COALESCE(SUM(quantidade), 0) AS total FROM pedidos'),
      receitaCentavos: scalar('SELECT COALESCE(SUM(total_centavos), 0) AS total FROM pedidos'),
      hoje: scalar('SELECT COUNT(*) AS total FROM pedidos WHERE date(criado_em) = ?', date),
    }),
  };
}

import { ROLES } from '../config/constants.js';

const UPDATABLE_COLUMNS = ['nome', 'telefone', 'email', 'senha_hash'];

export function createUsuariosRepository(db) {
  const byId = db.prepare('SELECT * FROM usuarios WHERE id = ?');
  const byEmail = db.prepare('SELECT * FROM usuarios WHERE email = ?');

  return {
    findById: (id) => byId.get(id),
    findByEmail: (email) => byEmail.get(email),
    emailTakenByOther: (email, id) => Boolean(db.prepare('SELECT 1 FROM usuarios WHERE email = ? AND id <> ?').get(email, id)),
    insert({ nome, email, telefone, senhaHash, papel = ROLES.USER }) {
      const result = db
        .prepare('INSERT INTO usuarios (nome, email, telefone, senha_hash, papel) VALUES (?, ?, ?, ?, ?)')
        .run(nome, email, telefone, senhaHash, papel);
      return byId.get(result.lastInsertRowid);
    },
    update(id, fields) {
      const columns = Object.keys(fields).filter((column) => UPDATABLE_COLUMNS.includes(column));
      if (!columns.length) return;
      const assignments = columns.map((column) => `${column} = ?`).join(', ');
      db.prepare(`UPDATE usuarios SET ${assignments} WHERE id = ?`).run(...columns.map((column) => fields[column]), id);
    },
    setRole: (id, role) => db.prepare('UPDATE usuarios SET papel = ? WHERE id = ?').run(role, id),
    listWithOrderCount: () =>
      db
        .prepare('SELECT u.*, (SELECT COUNT(*) FROM pedidos WHERE usuario_id = u.id) AS pedidos FROM usuarios u ORDER BY u.id DESC')
        .all(),
    listSuperadmins: () =>
      db.prepare('SELECT id, nome, email, criado_em FROM usuarios WHERE papel = ? ORDER BY id').all(ROLES.SUPERADMIN),
    countSuperadmins: () => db.prepare('SELECT COUNT(*) AS total FROM usuarios WHERE papel = ?').get(ROLES.SUPERADMIN).total,
  };
}

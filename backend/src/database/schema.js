export function createSchema(db) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT NOT NULL DEFAULT '',
      senha_hash TEXT NOT NULL,
      papel TEXT NOT NULL DEFAULT 'usuario' CHECK (papel IN ('usuario','superadmin')),
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tipos_ingresso (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      preco_centavos INTEGER NOT NULL,
      imagem TEXT NOT NULL,
      descricao TEXT NOT NULL,
      ativo INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS atividades (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      imagem TEXT NOT NULL,
      alt TEXT NOT NULL,
      descricao TEXT NOT NULL,
      ordem INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT NOT NULL UNIQUE,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      tipo_id TEXT NOT NULL,
      tipo_nome TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      data_visita TEXT NOT NULL,
      total_centavos INTEGER NOT NULL,
      email_enviado INTEGER NOT NULL DEFAULT 0,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

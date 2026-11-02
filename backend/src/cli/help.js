export const HELP = `Uso: node src/cli.js superadmin <comando> [opções]

Comandos:
  criar       --email <e> --nome <n> [--senha <s>] [--telefone <t>]   Cria um superadmin (ou promove usuário existente)
  atualizar   --email <e> [--nome <n>] [--novo-email <e>] [--senha <s>] [--telefone <t>]
  promover    --email <e>      Torna um usuário existente superadmin
  rebaixar    --email <e>      Remove o papel de superadmin
  listar                       Lista os superadmins

Se --senha for omitida, será solicitada de forma oculta (ou lida da entrada padrão).
Variável DATA_DIR define onde está o banco (padrão: ./data).`;

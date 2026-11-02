import { createUsuariosRepository } from '../repositories/usuarios.js';
import { parseArguments } from './arguments.js';
import { createSuperadmin, demote, listSuperadmins, promote, updateSuperadmin } from './commands.js';
import { isValidEmail, normalizeEmail } from './email.js';
import { HELP } from './help.js';

const COMMANDS_ON_EXISTING_USER = { promover: promote, rebaixar: demote, atualizar: updateSuperadmin };

export async function run(argv, db, log = console.log) {
  const { options, positional } = parseArguments(argv);
  const [group, command] = positional;
  if (group !== 'superadmin' || !command) {
    log(HELP);
    return group ? 1 : 0;
  }

  const usuarios = createUsuariosRepository(db);
  if (command === 'listar') {
    listSuperadmins({ usuarios, log });
    return 0;
  }

  const email = normalizeEmail(options.email);
  if (!isValidEmail(email)) throw new Error('Informe um --email válido');
  const context = { usuarios, options, email, existing: usuarios.findByEmail(email), log };

  if (command === 'criar') {
    await createSuperadmin(context);
    return 0;
  }
  if (!context.existing) throw new Error(`Usuário ${email} não encontrado`);

  const action = COMMANDS_ON_EXISTING_USER[command];
  if (!action) {
    log(HELP);
    return 1;
  }
  await action(context);
  return 0;
}

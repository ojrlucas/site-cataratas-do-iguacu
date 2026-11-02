import { ROLES } from '../config/constants.js';
import { hashPassword } from '../services/passwords.js';
import { isValidEmail, normalizeEmail } from './email.js';
import { resolvePassword } from './prompt.js';

export function listSuperadmins({ usuarios, log }) {
  const admins = usuarios.listSuperadmins();
  if (!admins.length) log('Nenhum superadmin cadastrado.');
  admins.forEach((a) => log(`#${a.id}  ${a.email}  (${a.nome})  criado em ${a.criado_em}`));
}

export async function createSuperadmin({ usuarios, options, email, existing, log }) {
  if (existing) {
    usuarios.setRole(existing.id, ROLES.SUPERADMIN);
    if (options.senha !== undefined) usuarios.update(existing.id, { senha_hash: hashPassword(await resolvePassword(options)) });
    log(`Usuário existente ${email} promovido a superadmin.`);
    return;
  }
  if (!options.nome || options.nome.trim().length < 3) throw new Error('Informe --nome (mínimo 3 caracteres)');
  const senhaHash = hashPassword(await resolvePassword(options, { confirm: true }));
  usuarios.insert({ nome: options.nome.trim(), email, telefone: options.telefone ?? '', senhaHash, papel: ROLES.SUPERADMIN });
  log(`Superadmin ${email} criado.`);
}

export function promote({ usuarios, email, existing, log }) {
  usuarios.setRole(existing.id, ROLES.SUPERADMIN);
  log(`${email} agora é superadmin.`);
}

export function demote({ usuarios, options, email, existing, log }) {
  const isLastSuperadmin = existing.papel === ROLES.SUPERADMIN && usuarios.countSuperadmins() <= 1;
  if (isLastSuperadmin && !('forcar' in options)) {
    throw new Error('Este é o único superadmin. Use --forcar sim para rebaixar mesmo assim.');
  }
  usuarios.setRole(existing.id, ROLES.USER);
  log(`${email} não é mais superadmin.`);
}

function resolveNewEmail(usuarios, options, existing) {
  const newEmail = normalizeEmail(options['novo-email']);
  if (!isValidEmail(newEmail)) throw new Error('--novo-email inválido');
  if (usuarios.emailTakenByOther(newEmail, existing.id)) throw new Error('Já existe usuário com o novo e-mail');
  return newEmail;
}

export async function updateSuperadmin({ usuarios, options, email, existing, log }) {
  if (existing.papel !== ROLES.SUPERADMIN) throw new Error(`${email} não é superadmin (use "promover" antes)`);
  const changes = {};
  if (options.nome) changes.nome = options.nome.trim();
  if (options.telefone !== undefined) changes.telefone = options.telefone;
  if (options['novo-email']) changes.email = resolveNewEmail(usuarios, options, existing);
  if (options.senha !== undefined || !Object.keys(changes).length) {
    changes.senha_hash = hashPassword(await resolvePassword(options, { confirm: true }));
  }
  usuarios.update(existing.id, changes);
  const labels = Object.keys(changes).map((column) => (column === 'senha_hash' ? 'senha' : column));
  log(`Superadmin ${email} atualizado (${labels.join(', ')}).`);
}

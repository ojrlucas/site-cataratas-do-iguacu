import bcrypt from 'bcryptjs';
import { BCRYPT_COST } from '../config/constants.js';

const DECOY_HASH = bcrypt.hashSync('senha-inexistente', BCRYPT_COST);

export const hashPassword = (plain) => bcrypt.hashSync(plain, BCRYPT_COST);

export function verifyPassword(plain, hash) {
  const matches = bcrypt.compareSync(plain, hash ?? DECOY_HASH);
  return Boolean(hash) && matches;
}

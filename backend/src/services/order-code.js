import crypto from 'node:crypto';
import { ORDER_CODE_PREFIX } from '../config/constants.js';

export const generateOrderCode = () => ORDER_CODE_PREFIX + crypto.randomBytes(5).toString('hex').toUpperCase();

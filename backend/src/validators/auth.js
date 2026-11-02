import { z } from 'zod';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../config/constants.js';

const email = z.string().trim().toLowerCase().email('E-mail inválido');

export const registroSchema = z
  .object({
    nome: z.string().trim().min(3, 'Informe o nome completo'),
    email,
    telefone: z.string().trim().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos (com DDD)'),
    senha: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `A senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres`)
      .max(MAX_PASSWORD_LENGTH, `A senha deve ter no máximo ${MAX_PASSWORD_LENGTH} caracteres`),
    confirmacaoSenha: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmacaoSenha, { message: 'As senhas não conferem', path: ['confirmacaoSenha'] });

export const loginSchema = z.object({
  email,
  senha: z.string().min(1, 'Informe a senha').max(MAX_PASSWORD_LENGTH, 'Senha inválida'),
});

export const esqueciSenhaSchema = z.object({ email: z.string().trim().email('E-mail inválido') });

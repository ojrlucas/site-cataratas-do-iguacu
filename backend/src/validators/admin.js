import { z } from 'zod';
import { ROLES } from '../config/constants.js';

const imagem = z.string().regex(/^imagens\/[\w.-]+$/, 'Imagem inválida');

export const papelSchema = z.object({ papel: z.enum([ROLES.USER, ROLES.SUPERADMIN]) });

export const tipoSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o nome').max(60),
  precoCentavos: z.number().int().min(0, 'Preço inválido').max(1_000_000),
  descricao: z.string().trim().min(5, 'Informe a descrição').max(600),
  imagem,
  ativo: z.boolean().default(true),
});

export const atividadeSchema = z.object({
  titulo: z.string().trim().min(2, 'Informe o título').max(60),
  descricao: z.string().trim().min(10, 'Informe a descrição').max(1500),
  imagem,
  alt: z.string().trim().min(2).max(120).optional(),
});

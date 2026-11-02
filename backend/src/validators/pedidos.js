import { z } from 'zod';

export const pedidoSchema = z.object({
  tipoId: z.string(),
  quantidade: z.number().int().min(1, 'Mínimo 1 ingresso').max(10, 'Máximo 10 ingressos por pedido'),
  dataVisita: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
});

import { HttpError, notFound } from '../shared/http-error.js';

export const apiNotFound = (_req, _res, next) => next(notFound('Rota não encontrada'));

export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) return res.status(error.status).json({ erro: error.message, campos: error.fields });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
  console.error(error);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

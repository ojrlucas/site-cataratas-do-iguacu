import { badRequest } from './http-error.js';

export function validate(schema, body) {
  const result = schema.safeParse(body);
  if (result.success) return result.data;
  const fields = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || '_';
    fields[key] ??= issue.message;
  }
  throw badRequest(Object.values(fields)[0], fields);
}

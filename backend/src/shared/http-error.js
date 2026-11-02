export class HttpError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export const badRequest = (message, fields) => new HttpError(400, message, fields);
export const unauthorized = (message) => new HttpError(401, message);
export const forbidden = (message) => new HttpError(403, message);
export const notFound = (message) => new HttpError(404, message);
export const conflict = (message, fields) => new HttpError(409, message, fields);
export const badGateway = (message) => new HttpError(502, message);

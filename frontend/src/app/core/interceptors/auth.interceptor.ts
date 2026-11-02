import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { Auth } from '../services/auth';

const API_PREFIX = '/api';
const LOGIN_PATH = '/auth/login';
const UNAUTHORIZED = 401;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.token();
  const request = token && req.url.startsWith(API_PREFIX) ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    tap({
      error: (erro) => {
        if (erro.status === UNAUTHORIZED && token && !req.url.includes(LOGIN_PATH)) auth.sair(false);
      },
    }),
  );
};

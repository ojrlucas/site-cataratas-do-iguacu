import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  return auth.admin() ? true : inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: '/admin' } });
};

export function destinoSeguro(url: string | null): string {
  return url && url.startsWith('/') && !url.startsWith('//') && !url.includes('\\') ? url : '/';
}

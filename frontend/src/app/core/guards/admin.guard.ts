import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  if (inject(Auth).admin()) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: '/admin' } });
};

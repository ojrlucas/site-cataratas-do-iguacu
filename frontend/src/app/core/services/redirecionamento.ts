import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { destinoSeguro } from '../utils/safe-redirect';

@Injectable({ providedIn: 'root' })
export class Redirecionamento {
  private router = inject(Router);

  retorno = (rota: ActivatedRoute): string | null => rota.snapshot.queryParamMap.get('returnUrl');

  concluirAutenticacao = (rota: ActivatedRoute) => this.router.navigateByUrl(destinoSeguro(this.retorno(rota)));
}

import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface Usuario { id: number; nome: string; email: string; telefone: string }
interface Sessao { token: string; usuario: Usuario }
const CHAVE = 'cpi_sessao';

function ler(): Sessao | null {
  try { return JSON.parse(localStorage.getItem(CHAVE) ?? 'null'); } catch { return null; }
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sessao = signal<Sessao | null>(ler());
  usuario = computed(() => this.sessao()?.usuario ?? null);
  logado = computed(() => !!this.sessao());
  token = () => this.sessao()?.token ?? null;

  private salvar = (s: Sessao) => {
    try { localStorage.setItem(CHAVE, JSON.stringify(s)); } catch { /* ignore */ }
    this.sessao.set(s);
  };

  login(email: string, senha: string) {
    return this.http.post<Sessao>('/api/auth/login', { email, senha }).pipe(tap(this.salvar));
  }
  registrar(dados: Record<string, string>) {
    return this.http.post<Sessao>('/api/auth/registro', dados).pipe(tap(this.salvar));
  }
  sair(redirecionar = true) {
    try { localStorage.removeItem(CHAVE); } catch { /* ignore */ }
    this.sessao.set(null);
    if (redirecionar) this.router.navigateByUrl('/');
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.token();
  const r = token && req.url.startsWith('/api') ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(r).pipe(
    tap({
      error: (e) => {
        if (e.status === 401 && token && !req.url.includes('/auth/login')) auth.sair(false);
      },
    }),
  );
};

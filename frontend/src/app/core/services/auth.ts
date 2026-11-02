import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Sessao, Usuario } from '../models/api.models';
import { lerJsonArmazenado, removerArmazenado, salvarArmazenado } from '../utils/storage';

const SESSAO_CHAVE = 'cpi_sessao';
const AUTH_API = '/api/auth';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sessao = signal<Sessao | null>(lerJsonArmazenado<Sessao>(SESSAO_CHAVE));

  usuario = computed(() => this.sessao()?.usuario ?? null);
  logado = computed(() => this.sessao() !== null);
  admin = computed(() => this.sessao()?.usuario.papel === 'superadmin');
  token = () => this.sessao()?.token ?? null;

  atualizar() {
    const sessao = this.sessao();
    if (!sessao) return;
    this.http.get<Usuario>(`${AUTH_API}/me`).subscribe({
      next: (usuario) => this.guardar({ token: sessao.token, usuario }),
      error: () => undefined,
    });
  }

  login(email: string, senha: string) {
    return this.http.post<Sessao>(`${AUTH_API}/login`, { email, senha }).pipe(tap((s) => this.guardar(s)));
  }

  registrar(dados: Record<string, string>) {
    return this.http.post<Sessao>(`${AUTH_API}/registro`, dados).pipe(tap((s) => this.guardar(s)));
  }

  sair(redirecionar = true) {
    removerArmazenado(SESSAO_CHAVE);
    this.sessao.set(null);
    if (redirecionar) this.router.navigateByUrl('/');
  }

  private guardar(sessao: Sessao) {
    salvarArmazenado(SESSAO_CHAVE, JSON.stringify(sessao));
    this.sessao.set(sessao);
  }
}

import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../core/auth';
import { TemaBotao } from '../core/tema';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, TemaBotao],
  template: `
    <nav class="navbar d-flex align-items-center position-fixed">
      <section class="nav-logo">
        <a routerLink="/" aria-label="Voltar para a página inicial">
          <img src="imagens/parque-logo.png" alt="Imagem da logo das Cataratas do Iguaçu" />
        </a>
      </section>

      <section class="nav-links d-flex align-items-center">
        <i (click)="aberto.set(!aberto())" (keydown.enter)="aberto.set(!aberto())" tabindex="0" class="bi bi-list color-white" role="button" [attr.aria-expanded]="aberto()" aria-label="Abrir menu"></i>
        <ul id="nav-links-lista" class="list-unstyled w-100" [class.aberto]="aberto()" (click)="aberto.set(false)">
          <li><a class="color-white text-decoration-none" routerLink="/" routerLinkActive="ativo" [routerLinkActiveOptions]="{ exact: true }"><i class="bi bi-house-fill"></i> Home</a></li>
          <li><a class="color-white text-decoration-none" routerLink="/sobre" routerLinkActive="ativo"><i class="bi bi-info-circle-fill"></i> Sobre</a></li>
          <li><a class="color-white text-decoration-none" routerLink="/lazer" routerLinkActive="ativo"><i class="bi bi-tree-fill"></i> Lazer</a></li>
          <li><a class="color-white text-decoration-none" routerLink="/ingressos" routerLinkActive="ativo"><i class="bi bi-ticket-perforated-fill"></i> Ingressos</a></li>
          @if (auth.admin()) {
            <li><a class="color-white text-decoration-none" routerLink="/admin" routerLinkActive="ativo"><i class="bi bi-shield-lock-fill"></i> Admin</a></li>
          }
          <li class="login-registro w-100 d-flex justify-content-center">
            <div class="d-flex align-items-center gap-2">
              <app-tema />
              @if (auth.usuario(); as u) {
                <span class="nav-usuario me-2">Olá, {{ primeiroNome(u.nome) }}</span>
                <a (click)="sair()" class="btn d-inline-flex justify-content-center text-center text-white text-decoration-none">Sair</a>
              } @else {
                <a routerLink="/login" class="btn d-inline-flex justify-content-center text-center text-white text-decoration-none">Login</a>
                <a routerLink="/registre-se" class="btn d-inline-flex justify-content-center text-center text-white text-decoration-none">Registre-se</a>
              }
            </div>
          </li>
        </ul>
      </section>

      <section class="nav-natureza-img mt-5">
        <img src="imagens/nav-natureza-img.png" alt="Imagem de um rio com uma árvore" />
      </section>
    </nav>
  `,
})
export class Nav {
  auth = inject(Auth);
  aberto = signal(false);
  primeiroNome = (n: string) => n.split(' ')[0];
  sair() { this.auth.sair(); }
}

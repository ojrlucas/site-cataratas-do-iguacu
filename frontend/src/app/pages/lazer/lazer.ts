import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api, Atividade } from '../../core/api';

@Component({
  selector: 'app-lazer',
  imports: [RouterLink],
  template: `
    <section class="bg-titulo d-flex justify-content-center align-items-center flex-column color-white">
      <div class="titulo">
        <h1 class="text-center text-uppercase">
          <span class="titulo-esquerda fw-normal d-block text-uppercase">parque</span>
          nacional do Iguaçu
          <span class="titulo-direita fw-normal d-block text-uppercase">patrimônio mundial natural</span>
        </h1>
      </div>
      <div class="comprar-ingresso mt-4">
        <a class="text-uppercase text-decoration-none color-white fw-bold" routerLink="/ingressos">COMPRAR INGRESSO</a>
      </div>
    </section>

    <section class="lazer-container d-flex flex-column align-items-center mb-5">
      <div class="subtitulo d-flex justify-content-center mt-4 mb-4">
        <h2 class="text-uppercase"><span class="azul fw-bold">lazer?</span> o lugar é aqui!</h2>
      </div>

      @if (erro()) { <p class="erro-pagina">Não foi possível carregar as atividades.</p> }
      <div class="lazer-area d-flex gap-5 flex-wrap justify-content-center align-items-center">
        @for (a of atividades(); track a.id) {
          <div class="flex-card d-flex mb-1">
            <img [src]="a.imagem" [alt]="a.alt" />
            <span [class.card-exibido]="aberto() === a.id">
              <h3 class="w-100 color-white text-center text-capitalize mt-3 mb-3">{{ a.titulo }}</h3>
              <p class="color-white">{{ a.descricao }}</p>
              <a (click)="alternar(a.id)" class="text-decoration-none d-flex align-items-center justify-content-center btn-link text-white">{{ aberto() === a.id ? 'Ler menos' : 'Ler mais' }}</a>
            </span>
          </div>
        }
      </div>
    </section>
  `,
})
export class Lazer {
  atividades = signal<Atividade[]>([]);
  erro = signal(false);
  aberto = signal<string | null>(null);
  constructor() {
    inject(Api).atividades().subscribe({ next: (a) => this.atividades.set(a), error: () => this.erro.set(true) });
  }
  alternar(id: string) { this.aberto.update((v) => (v === id ? null : id)); }
}

import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api, Atividade } from '../../core/api';
import { Modal } from '../../core/modal';

@Component({
  selector: 'app-lazer',
  imports: [RouterLink, Modal],
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

    <section class="pagina">
      <h2 class="secao-titulo"><b>lazer?</b> o lugar é aqui!</h2>
      <p class="secao-sub">Escolha uma experiência e descubra o Parque Nacional do Iguaçu de um jeito diferente.</p>

      @if (erro()) { <p class="erro-pagina">Não foi possível carregar as atividades.</p> }
      <div class="grade">
        @for (a of atividades(); track a.id) {
          <article class="cartao">
            <div class="cartao-img">
              <img [src]="a.imagem" [alt]="a.alt" loading="lazy" />
              <h3>{{ a.titulo }}</h3>
            </div>
            <div class="cartao-corpo">
              <p class="cartao-texto">{{ a.descricao }}</p>
              <div class="cartao-rodape">
                <button type="button" class="btn-cpi bloco" (click)="aberta.set(a)">Ler mais <i class="bi bi-arrow-right"></i></button>
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    @if (aberta(); as a) {
      <app-modal [rotulo]="a.titulo" (fechar)="aberta.set(null)">
        <div class="modal-img"><img [src]="a.imagem" [alt]="a.alt" /><h2>{{ a.titulo }}</h2></div>
        <div class="modal-corpo">
          <p>{{ a.descricao }}</p>
          <a routerLink="/ingressos" class="btn-cpi verde bloco">Garantir meu ingresso</a>
        </div>
      </app-modal>
    }
  `,
})
export class Lazer {
  atividades = signal<Atividade[]>([]);
  erro = signal(false);
  aberta = signal<Atividade | null>(null);

  constructor() {
    inject(Api).atividades().subscribe({ next: (a) => this.atividades.set(a), error: () => this.erro.set(true) });
  }
}

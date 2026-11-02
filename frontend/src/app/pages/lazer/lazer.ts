import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Atividade } from '../../core/models/api.models';
import { Api } from '../../core/services/api';
import { HeroParque } from '../../shared/components/hero-parque/hero-parque';
import { Modal } from '../../shared/components/modal/modal';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-lazer',
  imports: [RouterLink, Modal, Reveal, HeroParque],
  templateUrl: './lazer.html',
})
export class Lazer {
  readonly esqueletos = [1, 2, 3];

  atividades = signal<Atividade[]>([]);
  erro = signal(false);
  carregando = signal(true);
  aberta = signal<Atividade | null>(null);

  constructor() {
    inject(Api)
      .atividades()
      .subscribe({
        next: (lista) => {
          this.atividades.set(lista);
          this.carregando.set(false);
        },
        error: () => {
          this.erro.set(true);
          this.carregando.set(false);
        },
      });
  }

  abrir(atividade: Atividade) {
    this.aberta.set(atividade);
  }

  fechar() {
    this.aberta.set(null);
  }
}

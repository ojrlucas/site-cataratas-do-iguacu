import { Component, Injectable, inject, signal } from '@angular/core';

export type NomeTema = 'claro' | 'escuro';
const CHAVE = 'cpi_tema';

@Injectable({ providedIn: 'root' })
export class Tema {
  atual = signal<NomeTema>(document.documentElement.getAttribute('data-tema') === 'escuro' ? 'escuro' : 'claro');

  alternar() {
    this.aplicar(this.atual() === 'escuro' ? 'claro' : 'escuro');
  }

  private aplicar(t: NomeTema) {
    const raiz = document.documentElement;
    raiz.classList.add('trocando-tema');
    raiz.setAttribute('data-tema', t);
    this.atual.set(t);
    try { localStorage.setItem(CHAVE, t); } catch {}
    setTimeout(() => raiz.classList.remove('trocando-tema'), 600);
  }
}

@Component({
  selector: 'app-tema',
  template: `
    <button type="button" class="tema-btn" (click)="tema.alternar()" [attr.aria-label]="tema.atual() === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'" [attr.aria-pressed]="tema.atual() === 'escuro'" title="Alternar tema">
      <i class="bi sol bi-sun-fill"></i>
      <i class="bi lua bi-moon-stars-fill"></i>
    </button>
  `,
})
export class TemaBotao {
  tema = inject(Tema);
}

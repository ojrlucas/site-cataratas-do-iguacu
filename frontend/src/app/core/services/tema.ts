import { Injectable, signal } from '@angular/core';
import { salvarArmazenado } from '../utils/storage';

export type NomeTema = 'claro' | 'escuro';

const TEMA_CHAVE = 'cpi_tema';
const TEMA_ATTRIBUTE = 'data-tema';
const TRANSITION_CLASS = 'trocando-tema';
const TRANSITION_MS = 600;

@Injectable({ providedIn: 'root' })
export class Tema {
  atual = signal<NomeTema>(document.documentElement.getAttribute(TEMA_ATTRIBUTE) === 'escuro' ? 'escuro' : 'claro');

  alternar() {
    this.aplicar(this.atual() === 'escuro' ? 'claro' : 'escuro');
  }

  private aplicar(tema: NomeTema) {
    const raiz = document.documentElement;
    raiz.classList.add(TRANSITION_CLASS);
    raiz.setAttribute(TEMA_ATTRIBUTE, tema);
    this.atual.set(tema);
    salvarArmazenado(TEMA_CHAVE, tema);
    setTimeout(() => raiz.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
  }
}

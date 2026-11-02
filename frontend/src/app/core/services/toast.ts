import { Injectable, signal } from '@angular/core';

export interface Aviso {
  id: number;
  tipo: 'ok' | 'erro';
  texto: string;
}

const DURACAO_MS = 5000;

@Injectable({ providedIn: 'root' })
export class Toast {
  avisos = signal<Aviso[]>([]);
  private sequencia = 0;

  ok = (texto: string) => this.mostrar('ok', texto);
  erro = (texto: string) => this.mostrar('erro', texto);

  fechar(id: number) {
    this.avisos.update((lista) => lista.filter((aviso) => aviso.id !== id));
  }

  private mostrar(tipo: Aviso['tipo'], texto: string) {
    const id = ++this.sequencia;
    this.avisos.update((lista) => [...lista, { id, tipo, texto }]);
    setTimeout(() => this.fechar(id), DURACAO_MS);
  }
}

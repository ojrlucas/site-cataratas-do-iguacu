import { Component, Injectable, inject, signal } from '@angular/core';

export interface Aviso { id: number; tipo: 'ok' | 'erro'; texto: string }

@Injectable({ providedIn: 'root' })
export class Toast {
  avisos = signal<Aviso[]>([]);
  private seq = 0;

  ok(texto: string) { this.mostrar('ok', texto); }
  erro(texto: string) { this.mostrar('erro', texto); }

  fechar(id: number) { this.avisos.update((l) => l.filter((a) => a.id !== id)); }

  private mostrar(tipo: Aviso['tipo'], texto: string) {
    const id = ++this.seq;
    this.avisos.update((l) => [...l, { id, tipo, texto }]);
    setTimeout(() => this.fechar(id), 5000);
  }
}

@Component({
  selector: 'app-toasts',
  template: `
    <div class="toasts" aria-live="polite">
      @for (a of toast.avisos(); track a.id) {
        <div class="toast" [class.erro]="a.tipo === 'erro'" role="status">
          <i class="bi" [class.bi-check-circle-fill]="a.tipo === 'ok'" [class.bi-exclamation-triangle-fill]="a.tipo === 'erro'"></i>
          <span>{{ a.texto }}</span>
          <button type="button" (click)="toast.fechar(a.id)" aria-label="Fechar aviso"><i class="bi bi-x-lg"></i></button>
        </div>
      }
    </div>
  `,
})
export class Toasts {
  toast = inject(Toast);
}

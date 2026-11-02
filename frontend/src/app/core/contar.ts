import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({ selector: '[appContar]' })
export class Contar {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  appContar = input.required<number>();
  formato = input<'inteiro' | 'moeda'>('inteiro');

  constructor() {
    effect(() => {
      const alvo = this.appContar();
      const moeda = this.formato() === 'moeda';
      const fmt = (v: number) =>
        moeda ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : Math.round(v).toLocaleString('pt-BR');
      const el = this.el.nativeElement;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = fmt(alvo);
        return;
      }
      const inicio = performance.now();
      const duracao = 900;
      const passo = (agora: number) => {
        const t = Math.min(1, (agora - inicio) / duracao);
        el.textContent = fmt(alvo * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  }
}

import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({ selector: '[appReveal]' })
export class Reveal implements OnInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit() {
    const alvo = this.el.nativeElement;
    if (typeof IntersectionObserver === 'undefined') {
      alvo.classList.add('visivel');
      return;
    }
    this.observer = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          alvo.classList.add('visivel');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    this.observer.observe(alvo);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}

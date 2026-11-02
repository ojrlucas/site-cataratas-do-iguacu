import { Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'app-hero-parque',
  host: { class: 'sem-caixa' },
  templateUrl: './hero-parque.html',
})
export class HeroParque {
  inicio = input(false, { transform: booleanAttribute });
}

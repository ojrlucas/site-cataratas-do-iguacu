import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TipoIngresso } from '../../../../core/models/api.models';
import { Reveal } from '../../../../shared/directives/reveal';

@Component({
  selector: 'app-bilhete',
  imports: [CurrencyPipe, Reveal],
  host: { class: 'sem-caixa' },
  templateUrl: './bilhete.html',
})
export class Bilhete {
  tipo = input.required<TipoIngresso>();
  logado = input(false);
  indice = input(0);
  comprar = output<TipoIngresso>();
}

import { Component, inject } from '@angular/core';
import { Tema } from '../../../core/services/tema';

@Component({
  selector: 'app-tema',
  templateUrl: './tema-botao.html',
})
export class TemaBotao {
  tema = inject(Tema);
}

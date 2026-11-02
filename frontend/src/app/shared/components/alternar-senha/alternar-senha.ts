import { Component, model } from '@angular/core';

@Component({
  selector: 'app-alternar-senha',
  host: { class: 'sem-caixa' },
  templateUrl: './alternar-senha.html',
})
export class AlternarSenha {
  visivel = model(false);
}

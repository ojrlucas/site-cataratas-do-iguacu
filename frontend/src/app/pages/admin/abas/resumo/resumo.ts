import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Resumo } from '../../../../core/models/api.models';
import { Api } from '../../../../core/services/api';
import { mensagemErro } from '../../../../core/utils/http-error';
import { Contar } from '../../../../shared/directives/contar';

@Component({
  selector: 'app-admin-resumo',
  imports: [CurrencyPipe, Contar],
  host: { class: 'sem-caixa' },
  templateUrl: './resumo.html',
})
export class AdminResumo {
  resumo = signal<Resumo | null>(null);
  erro = signal('');

  constructor() {
    inject(Api).adminResumo().subscribe({
      next: (dados) => this.resumo.set(dados),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }
}

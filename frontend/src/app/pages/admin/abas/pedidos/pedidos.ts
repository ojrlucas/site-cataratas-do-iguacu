import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PedidoAdmin } from '../../../../core/models/api.models';
import { Api } from '../../../../core/services/api';
import { mensagemErro } from '../../../../core/utils/http-error';

@Component({
  selector: 'app-admin-pedidos',
  imports: [CurrencyPipe, DatePipe],
  host: { class: 'sem-caixa' },
  templateUrl: './pedidos.html',
})
export class AdminPedidos {
  pedidos = signal<PedidoAdmin[]>([]);
  erro = signal('');

  constructor() {
    inject(Api).adminPedidos().subscribe({
      next: (lista) => this.pedidos.set(lista),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }
}

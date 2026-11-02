import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pedido } from '../../../../core/models/api.models';

@Component({
  selector: 'app-lista-pedidos',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  host: { class: 'sem-caixa' },
  templateUrl: './lista-pedidos.html',
})
export class ListaPedidos {
  pedidos = input.required<Pedido[]>();
  logado = input(false);
  verQr = output<number>();
  reenviar = output<number>();
}

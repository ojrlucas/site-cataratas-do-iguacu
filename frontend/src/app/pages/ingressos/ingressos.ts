import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido, PedidoQr, TipoIngresso } from '../../core/models/api.models';
import { Api } from '../../core/services/api';
import { Auth } from '../../core/services/auth';
import { Toast } from '../../core/services/toast';
import { mensagemErro } from '../../core/utils/http-error';
import { HeroParque } from '../../shared/components/hero-parque/hero-parque';
import { Bilhete } from './components/bilhete/bilhete';
import { CompraModal } from './components/compra-modal/compra-modal';
import { ComprovanteModal } from './components/comprovante-modal/comprovante-modal';
import { ListaPedidos } from './components/lista-pedidos/lista-pedidos';

@Component({
  selector: 'app-ingressos',
  imports: [HeroParque, Bilhete, ListaPedidos, CompraModal, ComprovanteModal],
  templateUrl: './ingressos.html',
})
export class Ingressos {
  private api = inject(Api);
  private router = inject(Router);
  private toast = inject(Toast);
  readonly auth = inject(Auth);
  readonly esqueletos = [1, 2];

  tipos = signal<TipoIngresso[]>([]);
  pedidos = signal<Pedido[]>([]);
  carregando = signal(true);
  erro = signal('');
  comprando = signal<TipoIngresso | null>(null);
  comprovante = signal<PedidoQr | null>(null);

  constructor() {
    this.carregarTipos();
    this.carregarPedidos();
  }

  comprar(tipo: TipoIngresso) {
    if (!this.auth.logado()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/ingressos' } });
      return;
    }
    this.comprando.set(tipo);
  }

  aoConcluirCompra(pedido: Pedido) {
    this.comprando.set(null);
    this.carregarPedidos();
    this.toast.ok('Compra confirmada! Confira seu e-mail.');
    this.verQr(pedido.id);
  }

  verQr(id: number) {
    this.api.qrcode(id).subscribe({
      next: (pedido) => this.comprovante.set(pedido),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }

  reenviar(id: number) {
    this.api.reenviar(id).subscribe({
      next: (resposta) => {
        this.toast.ok(resposta.mensagem);
        this.carregarPedidos();
        this.comprovante.update((atual) => (atual ? { ...atual, emailEnviado: true } : atual));
      },
      error: (erro) => this.toast.erro(mensagemErro(erro)),
    });
  }

  private carregarTipos() {
    this.api.tipos().subscribe({
      next: (tipos) => {
        this.tipos.set(tipos);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os ingressos.');
        this.carregando.set(false);
      },
    });
  }

  private carregarPedidos() {
    if (!this.auth.logado()) return;
    this.api.pedidos().subscribe({ next: (pedidos) => this.pedidos.set(pedidos), error: () => undefined });
  }
}

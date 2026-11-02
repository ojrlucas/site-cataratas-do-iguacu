import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api, Pedido, PedidoQr, TipoIngresso, mensagemErro } from '../../core/api';
import { Auth } from '../../core/auth';
import { Modal } from '../../core/modal';

@Component({
  selector: 'app-ingressos',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe, Modal],
  templateUrl: './ingressos.html',
})
export class Ingressos {
  private api = inject(Api);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  auth = inject(Auth);

  tipos = signal<TipoIngresso[]>([]);
  pedidos = signal<Pedido[]>([]);
  erro = signal('');
  aviso = signal('');
  comprando = signal<TipoIngresso | null>(null);
  comprovante = signal<{ qr: PedidoQr } | null>(null);
  enviando = signal(false);
  erroForm = signal('');
  quantidade = signal(1);
  total = computed(() => ((this.comprando()?.precoCentavos ?? 0) * this.quantidade()) / 100);
  hoje = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  form = this.fb.nonNullable.group({ dataVisita: [this.hoje, Validators.required] });

  constructor() {
    this.api.tipos().subscribe({ next: (t) => this.tipos.set(t), error: () => this.erro.set('Não foi possível carregar os ingressos.') });
    this.carregarPedidos();
  }

  carregarPedidos() {
    if (this.auth.logado()) this.api.pedidos().subscribe({ next: (p) => this.pedidos.set(p), error: () => {} });
  }

  comprar(t: TipoIngresso) {
    if (!this.auth.logado()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/ingressos' } });
      return;
    }
    this.erroForm.set('');
    this.quantidade.set(1);
    this.form.reset({ dataVisita: this.hoje });
    this.comprando.set(t);
  }

  alterarQuantidade(delta: number) {
    this.quantidade.update((q) => Math.min(10, Math.max(1, q + delta)));
  }

  confirmar() {
    const t = this.comprando();
    if (!t || this.form.invalid || this.enviando()) return;
    const dataVisita = this.form.getRawValue().dataVisita;
    if (dataVisita < this.hoje) {
      this.erroForm.set('A data da visita não pode estar no passado.');
      return;
    }
    this.enviando.set(true);
    this.api.criarPedido({ tipoId: t.id, quantidade: this.quantidade(), dataVisita }).subscribe({
      next: (p) => {
        this.enviando.set(false);
        this.comprando.set(null);
        this.carregarPedidos();
        this.verQr(p.id);
      },
      error: (e) => {
        this.enviando.set(false);
        this.erroForm.set(mensagemErro(e));
      },
    });
  }

  verQr(id: number) {
    this.aviso.set('');
    this.api.qrcode(id).subscribe({
      next: (qr) => this.comprovante.set({ qr }),
      error: (e) => this.erro.set(mensagemErro(e)),
    });
  }

  reenviar(id: number) {
    this.aviso.set('');
    this.api.reenviar(id).subscribe({
      next: (r) => {
        this.aviso.set(r.mensagem);
        this.carregarPedidos();
        const atual = this.comprovante();
        if (atual) this.comprovante.set({ qr: { ...atual.qr, emailEnviado: true } });
      },
      error: (e) => this.aviso.set(mensagemErro(e)),
    });
  }
}

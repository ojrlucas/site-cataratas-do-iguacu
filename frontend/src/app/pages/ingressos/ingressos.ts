import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api, Pedido, PedidoQr, TipoIngresso, mensagemErro } from '../../core/api';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-ingressos',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe],
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
  lerMais = signal<string | null>(null);
  comprando = signal<TipoIngresso | null>(null);
  qr = signal<PedidoQr | null>(null);
  enviando = signal(false);
  erroForm = signal('');
  hoje = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  form = this.fb.nonNullable.group({
    quantidade: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    dataVisita: [this.hoje, Validators.required],
  });

  constructor() {
    this.api.tipos().subscribe({ next: (t) => this.tipos.set(t), error: () => this.erro.set('Não foi possível carregar os ingressos.') });
    this.carregarPedidos();
  }

  carregarPedidos() {
    if (this.auth.logado()) this.api.pedidos().subscribe({ next: (p) => this.pedidos.set(p), error: () => {} });
  }

  comprar(t: TipoIngresso) {
    if (!this.auth.logado()) { this.router.navigateByUrl('/login'); return; }
    this.erroForm.set('');
    this.form.reset({ quantidade: 1, dataVisita: this.hoje });
    this.comprando.set(t);
  }

  total() { return ((this.comprando()?.precoCentavos ?? 0) * (this.form.value.quantidade || 0)) / 100; }

  confirmar() {
    const t = this.comprando();
    if (!t || this.form.invalid || this.enviando()) return;
    const v = this.form.getRawValue();
    if (v.dataVisita < this.hoje) { this.erroForm.set('A data da visita não pode estar no passado.'); return; }
    this.enviando.set(true);
    this.api.criarPedido({ tipoId: t.id, quantidade: Number(v.quantidade), dataVisita: v.dataVisita }).subscribe({
      next: (p) => { this.enviando.set(false); this.comprando.set(null); this.carregarPedidos(); this.verQr(p.id); },
      error: (e) => { this.enviando.set(false); this.erroForm.set(mensagemErro(e)); },
    });
  }

  verQr(id: number) {
    this.api.qrcode(id).subscribe({ next: (q) => this.qr.set(q), error: (e) => this.erro.set(mensagemErro(e)) });
  }
}

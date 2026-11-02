import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pedido, TipoIngresso } from '../../../../core/models/api.models';
import { Api } from '../../../../core/services/api';
import { mensagemErro } from '../../../../core/utils/http-error';
import { Modal } from '../../../../shared/components/modal/modal';

const MIN_QUANTIDADE = 1;
const MAX_QUANTIDADE = 10;
const MS_POR_MINUTO = 60000;

@Component({
  selector: 'app-compra-modal',
  imports: [ReactiveFormsModule, CurrencyPipe, Modal],
  templateUrl: './compra-modal.html',
})
export class CompraModal {
  private api = inject(Api);
  private fb = inject(FormBuilder);

  tipo = input.required<TipoIngresso>();
  fechar = output<void>();
  concluida = output<Pedido>();

  readonly minQuantidade = MIN_QUANTIDADE;
  readonly maxQuantidade = MAX_QUANTIDADE;
  readonly hoje = new Date(Date.now() - new Date().getTimezoneOffset() * MS_POR_MINUTO).toISOString().slice(0, 10);
  readonly form = this.fb.nonNullable.group({ dataVisita: [this.hoje, Validators.required] });

  quantidade = signal(MIN_QUANTIDADE);
  enviando = signal(false);
  erro = signal('');
  total = computed(() => (this.tipo().precoCentavos * this.quantidade()) / 100);

  alterarQuantidade(delta: number) {
    this.quantidade.update((atual) => Math.min(MAX_QUANTIDADE, Math.max(MIN_QUANTIDADE, atual + delta)));
  }

  confirmar() {
    if (this.form.invalid || this.enviando()) return;
    const { dataVisita } = this.form.getRawValue();
    if (dataVisita < this.hoje) {
      this.erro.set('A data da visita não pode estar no passado.');
      return;
    }
    this.enviando.set(true);
    this.api.criarPedido({ tipoId: this.tipo().id, quantidade: this.quantidade(), dataVisita }).subscribe({
      next: (pedido) => {
        this.enviando.set(false);
        this.concluida.emit(pedido);
      },
      error: (erro) => {
        this.enviando.set(false);
        this.erro.set(mensagemErro(erro));
      },
    });
  }
}

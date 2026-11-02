import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMAGENS_CARD } from '../../../../core/constants/imagens';
import { TipoIngresso } from '../../../../core/models/api.models';
import { Api } from '../../../../core/services/api';
import { mensagemErro } from '../../../../core/utils/http-error';
import { Modal } from '../../../../shared/components/modal/modal';

type Edicao = TipoIngresso | 'novo';

const CENTAVOS_POR_REAL = 100;

@Component({
  selector: 'app-admin-ingressos',
  imports: [ReactiveFormsModule, CurrencyPipe, Modal],
  host: { class: 'sem-caixa' },
  templateUrl: './ingressos.html',
})
export class AdminIngressos {
  private api = inject(Api);
  private fb = inject(FormBuilder);

  readonly imagens = IMAGENS_CARD;
  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    preco: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    descricao: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(600)]],
    imagem: [IMAGENS_CARD[0], Validators.required],
    ativo: [true],
  });

  tipos = signal<TipoIngresso[]>([]);
  editando = signal<Edicao | null>(null);
  erro = signal('');
  erroForm = signal('');
  salvando = signal(false);

  constructor() {
    this.carregar();
  }

  editar(tipo: Edicao) {
    this.erroForm.set('');
    this.form.reset(
      tipo === 'novo'
        ? { nome: '', preco: 0, descricao: '', imagem: IMAGENS_CARD[0], ativo: true }
        : { nome: tipo.nome, preco: tipo.precoCentavos / CENTAVOS_POR_REAL, descricao: tipo.descricao, imagem: tipo.imagem, ativo: tipo.ativo },
    );
    this.editando.set(tipo);
  }

  fechar() {
    this.editando.set(null);
  }

  salvar() {
    const alvo = this.editando();
    if (!alvo || this.form.invalid || this.salvando()) return;
    const { preco, ...demais } = this.form.getRawValue();
    this.salvando.set(true);
    this.api.adminSalvarTipo({ ...demais, precoCentavos: Math.round(preco * CENTAVOS_POR_REAL) }, alvo === 'novo' ? undefined : alvo.id).subscribe({
      next: () => {
        this.salvando.set(false);
        this.fechar();
        this.carregar();
      },
      error: (erro) => {
        this.salvando.set(false);
        this.erroForm.set(mensagemErro(erro));
      },
    });
  }

  private carregar() {
    this.api.adminTipos().subscribe({
      next: (lista) => this.tipos.set(lista),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }
}

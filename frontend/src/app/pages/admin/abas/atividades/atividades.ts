import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMAGENS_CARD } from '../../../../core/constants/imagens';
import { Atividade } from '../../../../core/models/api.models';
import { Api } from '../../../../core/services/api';
import { mensagemErro } from '../../../../core/utils/http-error';
import { Modal } from '../../../../shared/components/modal/modal';

type Edicao = Atividade | 'nova';

@Component({
  selector: 'app-admin-atividades',
  imports: [ReactiveFormsModule, Modal],
  host: { class: 'sem-caixa' },
  templateUrl: './atividades.html',
})
export class AdminAtividades {
  private api = inject(Api);
  private fb = inject(FormBuilder);

  readonly imagens = IMAGENS_CARD;
  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    descricao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1500)]],
    imagem: [IMAGENS_CARD[0], Validators.required],
  });

  atividades = signal<Atividade[]>([]);
  editando = signal<Edicao | null>(null);
  erro = signal('');
  erroForm = signal('');
  salvando = signal(false);

  constructor() {
    this.carregar();
  }

  editar(atividade: Edicao) {
    this.erroForm.set('');
    this.form.reset(
      atividade === 'nova'
        ? { titulo: '', descricao: '', imagem: IMAGENS_CARD[0] }
        : { titulo: atividade.titulo, descricao: atividade.descricao, imagem: atividade.imagem },
    );
    this.editando.set(atividade);
  }

  fechar() {
    this.editando.set(null);
  }

  salvar() {
    const alvo = this.editando();
    if (!alvo || this.form.invalid || this.salvando()) return;
    this.salvando.set(true);
    this.api.adminSalvarAtividade(this.form.getRawValue(), alvo === 'nova' ? undefined : alvo.id).subscribe({
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

  excluir(atividade: Atividade) {
    if (!confirm(`Excluir a atividade "${atividade.titulo}"?`)) return;
    this.api.adminExcluirAtividade(atividade.id).subscribe({
      next: () => this.carregar(),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }

  private carregar() {
    this.api.atividades().subscribe({
      next: (lista) => this.atividades.set(lista),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }
}

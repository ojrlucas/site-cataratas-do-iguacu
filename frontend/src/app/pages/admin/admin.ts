import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Api, Atividade, IMAGENS_CARD, Papel, PedidoAdmin, Resumo, TipoIngresso, UsuarioAdmin, mensagemErro,
} from '../../core/api';
import { Auth } from '../../core/auth';
import { Modal } from '../../core/modal';

type Aba = 'resumo' | 'pedidos' | 'usuarios' | 'ingressos' | 'atividades';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, Modal],
  templateUrl: './admin.html',
})
export class Admin {
  private api = inject(Api);
  private fb = inject(FormBuilder);
  auth = inject(Auth);

  abas: { id: Aba; nome: string; icone: string }[] = [
    { id: 'resumo', nome: 'Resumo', icone: 'bi-speedometer2' },
    { id: 'pedidos', nome: 'Pedidos', icone: 'bi-receipt' },
    { id: 'usuarios', nome: 'Usuários', icone: 'bi-people-fill' },
    { id: 'ingressos', nome: 'Ingressos', icone: 'bi-ticket-perforated-fill' },
    { id: 'atividades', nome: 'Lazer', icone: 'bi-tree-fill' },
  ];
  aba = signal<Aba>('resumo');
  imagens = IMAGENS_CARD;
  erro = signal('');
  resumo = signal<Resumo | null>(null);
  pedidos = signal<PedidoAdmin[]>([]);
  usuarios = signal<UsuarioAdmin[]>([]);
  tipos = signal<TipoIngresso[]>([]);
  atividades = signal<Atividade[]>([]);

  editandoTipo = signal<TipoIngresso | 'novo' | null>(null);
  editandoAtividade = signal<Atividade | 'novo' | null>(null);
  erroForm = signal('');
  salvando = signal(false);

  formTipo = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    preco: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    descricao: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(600)]],
    imagem: [IMAGENS_CARD[0], Validators.required],
    ativo: [true],
  });
  formAtividade = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    descricao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1500)]],
    imagem: [IMAGENS_CARD[0], Validators.required],
  });

  constructor() {
    this.abrir('resumo');
  }

  abrir(a: Aba) {
    this.aba.set(a);
    this.erro.set('');
    const falha = (e: unknown) => this.erro.set(mensagemErro(e));
    if (a === 'resumo') this.api.adminResumo().subscribe({ next: (v) => this.resumo.set(v), error: falha });
    if (a === 'pedidos') this.api.adminPedidos().subscribe({ next: (v) => this.pedidos.set(v), error: falha });
    if (a === 'usuarios') this.api.adminUsuarios().subscribe({ next: (v) => this.usuarios.set(v), error: falha });
    if (a === 'ingressos') this.api.adminTipos().subscribe({ next: (v) => this.tipos.set(v), error: falha });
    if (a === 'atividades') this.api.atividades().subscribe({ next: (v) => this.atividades.set(v), error: falha });
  }

  alterarPapel(u: UsuarioAdmin, papel: string) {
    this.api.adminPapel(u.id, papel as Papel).subscribe({
      next: () => this.abrir('usuarios'),
      error: (e) => { this.erro.set(mensagemErro(e)); this.abrir('usuarios'); },
    });
  }

  editarTipo(t: TipoIngresso | 'novo') {
    this.erroForm.set('');
    this.formTipo.reset(
      t === 'novo'
        ? { nome: '', preco: 0, descricao: '', imagem: IMAGENS_CARD[0], ativo: true }
        : { nome: t.nome, preco: t.precoCentavos / 100, descricao: t.descricao, imagem: t.imagem, ativo: t.ativo },
    );
    this.editandoTipo.set(t);
  }

  salvarTipo() {
    const alvo = this.editandoTipo();
    if (!alvo || this.formTipo.invalid || this.salvando()) return;
    const v = this.formTipo.getRawValue();
    this.salvando.set(true);
    this.api
      .adminSalvarTipo({ nome: v.nome, precoCentavos: Math.round(v.preco * 100), descricao: v.descricao, imagem: v.imagem, ativo: v.ativo }, alvo === 'novo' ? undefined : alvo.id)
      .subscribe({
        next: () => { this.salvando.set(false); this.editandoTipo.set(null); this.abrir('ingressos'); },
        error: (e) => { this.salvando.set(false); this.erroForm.set(mensagemErro(e)); },
      });
  }

  editarAtividade(a: Atividade | 'novo') {
    this.erroForm.set('');
    this.formAtividade.reset(
      a === 'novo' ? { titulo: '', descricao: '', imagem: IMAGENS_CARD[0] } : { titulo: a.titulo, descricao: a.descricao, imagem: a.imagem },
    );
    this.editandoAtividade.set(a);
  }

  salvarAtividade() {
    const alvo = this.editandoAtividade();
    if (!alvo || this.formAtividade.invalid || this.salvando()) return;
    this.salvando.set(true);
    this.api.adminSalvarAtividade(this.formAtividade.getRawValue(), alvo === 'novo' ? undefined : alvo.id).subscribe({
      next: () => { this.salvando.set(false); this.editandoAtividade.set(null); this.abrir('atividades'); },
      error: (e) => { this.salvando.set(false); this.erroForm.set(mensagemErro(e)); },
    });
  }

  excluirAtividade(a: Atividade) {
    if (!confirm(`Excluir a atividade "${a.titulo}"?`)) return;
    this.api.adminExcluirAtividade(a.id).subscribe({ next: () => this.abrir('atividades'), error: (e) => this.erro.set(mensagemErro(e)) });
  }
}

import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Redirecionamento } from '../../core/services/redirecionamento';
import { campoInvalido } from '../../core/utils/forms';
import { mensagemErro } from '../../core/utils/http-error';
import { AlternarSenha } from '../../shared/components/alternar-senha/alternar-senha';

type CampoComErro = 'nome' | 'email' | 'telefone' | 'senha';

const MIN_SENHA = 8;
const MAX_SENHA = 72;
const TELEFONE_PADRAO = /^\d{10,11}$/;

const senhasIguais = (grupo: AbstractControl): ValidationErrors | null =>
  grupo.get('senha')?.value === grupo.get('confirmacaoSenha')?.value ? null : { senhasDiferentes: true };

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, AlternarSenha],
  templateUrl: './registro.html',
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private rota = inject(ActivatedRoute);
  private redirecionamento = inject(Redirecionamento);

  readonly form = this.fb.nonNullable.group(
    {
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(TELEFONE_PADRAO)]],
      senha: ['', [Validators.required, Validators.minLength(MIN_SENHA), Validators.maxLength(MAX_SENHA)]],
      confirmacaoSenha: ['', Validators.required],
    },
    { validators: senhasIguais },
  );

  enviando = signal(false);
  verSenha = signal(false);
  erro = signal('');

  invalido = (campo: CampoComErro) => campoInvalido(this.form.controls[campo]);

  senhasDiferentes = () => this.form.hasError('senhasDiferentes') && this.form.controls.confirmacaoSenha.touched;

  enviar() {
    this.erro.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.enviando.set(true);
    const dados = this.form.getRawValue();
    this.auth.registrar({ ...dados, telefone: dados.telefone.replace(/\D/g, '') }).subscribe({
      next: () => this.redirecionamento.concluirAutenticacao(this.rota),
      error: (erro) => {
        this.enviando.set(false);
        this.erro.set(mensagemErro(erro));
      },
    });
  }
}

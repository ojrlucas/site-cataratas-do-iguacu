import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../core/services/api';
import { Auth } from '../../core/services/auth';
import { Redirecionamento } from '../../core/services/redirecionamento';
import { campoInvalido } from '../../core/utils/forms';
import { mensagemErro } from '../../core/utils/http-error';
import { AlternarSenha } from '../../shared/components/alternar-senha/alternar-senha';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AlternarSenha],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private api = inject(Api);
  private rota = inject(ActivatedRoute);
  private redirecionamento = inject(Redirecionamento);

  readonly retorno = this.redirecionamento.retorno(this.rota);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  enviando = signal(false);
  verSenha = signal(false);
  erro = signal('');
  info = signal('');

  invalido = (campo: 'email' | 'senha') => campoInvalido(this.form.controls[campo]);

  enviar() {
    this.limparMensagens();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.enviando.set(true);
    const { email, senha } = this.form.getRawValue();
    this.auth.login(email, senha).subscribe({
      next: () => this.redirecionamento.concluirAutenticacao(this.rota),
      error: (erro) => {
        this.enviando.set(false);
        this.erro.set(mensagemErro(erro));
      },
    });
  }

  recuperarSenha() {
    this.limparMensagens();
    const email = this.form.controls.email;
    if (email.invalid) {
      email.markAsTouched();
      this.erro.set('Informe seu e-mail para recuperar a senha.');
      return;
    }
    this.api.esqueciSenha(email.value).subscribe({
      next: (resposta) => this.info.set(resposta.mensagem),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }

  private limparMensagens() {
    this.erro.set('');
    this.info.set('');
  }
}

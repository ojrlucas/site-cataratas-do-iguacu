import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { destinoSeguro } from '../../core/guards';
import { Api, mensagemErro } from '../../core/api';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="container-login-registro position-fixed d-flex bg-titulo">
      <section class="main-login-registro position-fixed d-flex flex-column align-items-center justify-content-center">
        <div class="formulario d-flex justify-content-center align-items-center flex-column color-white">
          <h1>Acessar Conta</h1>
          <form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
            <label class="d-block" for="email">E-mail:</label>
            <input type="email" id="email" formControlName="email" placeholder="  seuemail@exemplo.com" aria-label="Digite seu e-mail" autocomplete="email" />
            @if (inv('email')) { <span class="erro-form">Informe um e-mail válido.</span> }
            <label class="d-block" for="senha">Senha:</label>
            <input type="password" id="senha" formControlName="senha" placeholder="  Sua senha" aria-label="Digite sua senha" autocomplete="current-password" />
            @if (inv('senha')) { <span class="erro-form">Informe a senha.</span> }

            <div class="esqueceu-senha">
              <a class="color-white" (click)="esqueci()" aria-label="Recuperar senha">Esqueceu sua senha?</a>
            </div>
            @if (erro()) { <span class="erro-form">{{ erro() }}</span> }
            @if (info()) { <span class="sucesso-form">{{ info() }}</span> }

            <button class="form color-white" type="submit" [disabled]="enviando()">{{ enviando() ? 'Entrando...' : 'Fazer Login' }}</button>
          </form>

          <div class="registro-login-link color-white text-center">
            <p>Não possui uma conta? <a class="color-white" routerLink="/registre-se" [queryParams]="{ returnUrl: rota.snapshot.queryParamMap.get('returnUrl') }" aria-label="Ir para a página de registro">Registre-se</a></p>
          </div>
        </div>
      </section>

      <section class="logo-login-registro logo-background logo-style d-flex justify-content-center align-items-center">
        <a routerLink="/" aria-label="Voltar para a página inicial"><img src="imagens/parque-logo.png" alt="Imagem da logo das Cataratas do Iguaçu" /></a>
      </section>
    </main>
  `,
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private api = inject(Api);
  private router = inject(Router);
  rota = inject(ActivatedRoute);
  form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], senha: ['', Validators.required] });
  enviando = signal(false);
  erro = signal('');
  info = signal('');
  inv(c: 'email' | 'senha') { const x = this.form.controls[c]; return x.invalid && (x.touched || x.dirty); }

  enviar() {
    this.erro.set(''); this.info.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.enviando.set(true);
    const { email, senha } = this.form.getRawValue();
    this.auth.login(email, senha).subscribe({
      next: () => this.router.navigateByUrl(destinoSeguro(this.rota.snapshot.queryParamMap.get('returnUrl'))),
      error: (e) => { this.enviando.set(false); this.erro.set(mensagemErro(e)); },
    });
  }

  esqueci() {
    this.erro.set(''); this.info.set('');
    const c = this.form.controls.email;
    if (c.invalid) { c.markAsTouched(); this.erro.set('Informe seu e-mail para recuperar a senha.'); return; }
    this.api.esqueciSenha(c.value).subscribe({ next: (r) => this.info.set(r.mensagem), error: (e) => this.erro.set(mensagemErro(e)) });
  }
}

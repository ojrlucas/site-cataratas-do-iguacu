import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { destinoSeguro } from '../../core/guards';
import { mensagemErro } from '../../core/api';
import { Auth } from '../../core/auth';

const senhasIguais = (g: AbstractControl): ValidationErrors | null =>
  g.get('senha')?.value === g.get('confirmacaoSenha')?.value ? null : { senhasDiferentes: true };

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="container-login-registro position-fixed d-flex bg-titulo">
      <section class="main-login-registro position-fixed d-flex flex-column align-items-center justify-content-center">
        <div class="formulario d-flex justify-content-center align-items-center flex-column color-white">
          <h1>Criar Conta</h1>
          <form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
            <label for="nome">Nome Completo:</label>
            <input type="text" id="nome" formControlName="nome" aria-label="Digite o seu nome completo" autocomplete="name" />
            @if (inv('nome')) { <span class="erro-form">Informe o nome completo.</span> }

            <div class="email-numero-container">
              <div>
                <label for="email">E-mail:</label>
                <input type="email" id="email" formControlName="email" placeholder="  seuemail@exemplo.com" aria-label="Digite seu e-mail" autocomplete="email" />
                @if (inv('email')) { <span class="erro-form">Informe um e-mail válido.</span> }
              </div>
              <div class="numero">
                <label for="numero">Número de Telefone:</label>
                <input type="tel" id="numero" formControlName="telefone" placeholder="  (00) 90000-0000" aria-label="Digite seu número" autocomplete="tel" />
                @if (inv('telefone')) { <span class="erro-form">Telefone com DDD (10 ou 11 dígitos).</span> }
              </div>
            </div>

            <div class="senha-confirmacao-container">
              <div>
                <label for="senha">Crie uma Senha:</label>
                <input type="password" id="senha" formControlName="senha" aria-label="Crie uma senha" autocomplete="new-password" />
                @if (inv('senha')) { <span class="erro-form">Entre 8 e 72 caracteres.</span> }
              </div>
              <div class="confirmacao-senha">
                <label for="confirmacao-senha">Confirme sua Senha:</label>
                <input type="password" id="confirmacao-senha" formControlName="confirmacaoSenha" aria-label="Confirme sua senha" autocomplete="new-password" />
                @if (form.hasError('senhasDiferentes') && form.controls.confirmacaoSenha.touched) { <span class="erro-form">As senhas não conferem.</span> }
              </div>
            </div>

            @if (erro()) { <span class="erro-form">{{ erro() }}</span> }
            <button class="form color-white" type="submit" [disabled]="enviando()">{{ enviando() ? 'Criando...' : 'Registre-se' }}</button>
          </form>

          <div class="registro-login-link color-white text-center">
            <p>Já possui uma conta? <a class="color-white" routerLink="/login" aria-label="Ir para a página de login">Fazer Login</a></p>
          </div>
        </div>
      </section>

      <section class="logo-login-registro logo-background logo-style d-flex justify-content-center align-items-center">
        <a routerLink="/" aria-label="Voltar para a página inicial"><img src="imagens/parque-logo.png" alt="Imagem da logo das Cataratas do Iguaçu" /></a>
      </section>
    </main>
  `,
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);
  form = this.fb.nonNullable.group(
    {
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmacaoSenha: ['', Validators.required],
    },
    { validators: senhasIguais },
  );
  enviando = signal(false);
  erro = signal('');
  inv(c: 'nome' | 'email' | 'telefone' | 'senha') { const x = this.form.controls[c]; return x.invalid && (x.touched || x.dirty); }

  enviar() {
    this.erro.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.enviando.set(true);
    const v = { ...this.form.getRawValue(), telefone: this.form.getRawValue().telefone.replace(/\D/g, '') };
    this.auth.registrar(v).subscribe({
      next: () => this.router.navigateByUrl(destinoSeguro(this.rota.snapshot.queryParamMap.get('returnUrl'))),
      error: (e) => { this.enviando.set(false); this.erro.set(mensagemErro(e)); },
    });
  }
}

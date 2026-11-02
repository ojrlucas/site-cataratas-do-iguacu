import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { TemaBotao } from '../../shared/components/tema-botao/tema-botao';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, TemaBotao],
  templateUrl: './nav.html',
})
export class Nav {
  auth = inject(Auth);
  aberto = signal(false);

  primeiroNome = (nome: string) => nome.split(' ')[0];

  alternarMenu() {
    this.aberto.update((aberto) => !aberto);
  }

  fecharMenu() {
    this.aberto.set(false);
  }

  sair() {
    this.auth.sair();
  }
}

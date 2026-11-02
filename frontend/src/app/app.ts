import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Auth } from './core/services/auth';
import { Footer } from './layout/footer/footer';
import { Nav } from './layout/nav/nav';
import { TemaBotao } from './shared/components/tema-botao/tema-botao';
import { Toasts } from './shared/components/toasts/toasts';

const ROTAS_SEM_LAYOUT = /^\/(login|registre-se)/;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, Toasts, TemaBotao],
  templateUrl: './app.html',
})
export class App {
  private router = inject(Router);
  semLayout = signal(ROTAS_SEM_LAYOUT.test(location.pathname));

  constructor() {
    inject(Auth).atualizar();
    this.router.events
      .pipe(filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd))
      .subscribe((evento) => this.semLayout.set(ROTAS_SEM_LAYOUT.test(evento.urlAfterRedirects)));
  }
}

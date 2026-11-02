import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Nav } from './layout/nav';
import { Footer } from './layout/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer],
  template: `
    @if (semLayout()) {
      <router-outlet />
    } @else {
      <div id="container">
        <app-nav />
        <main><router-outlet /></main>
      </div>
      <div id="container"><app-footer /></div>
    }
  `,
})
export class App {
  private router = inject(Router);
  semLayout = signal(/^\/(login|registre-se)/.test(location.pathname));
  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) =>
      this.semLayout.set(/^\/(login|registre-se)/.test((e as NavigationEnd).urlAfterRedirects)),
    );
  }
}

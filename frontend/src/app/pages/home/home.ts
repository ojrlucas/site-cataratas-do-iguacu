import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Api, Parque } from '../../core/api';

type Painel = 'funcionamento' | 'como-chegar' | 'estacionamento' | 'mapa' | null;

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  painel = signal<Painel>(null);
  parque = signal<Parque | null>(null);
  mapaUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3602.334372034531!2d-53.8177841!3d-25.460508!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f14d6db34e243d%3A0x6e633cd35854aa8f!2sParque%20Nacional%20Igua%C3%A7u!5e0!3m2!1spt-BR!2sbr!4v1747163159901!5m2!1spt-BR!2sbr';
  mapaSeguro: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(this.mapaUrl);
  constructor() { inject(Api).parque().subscribe({ next: (p) => this.parque.set(p), error: () => {} }); }
  abrir(p: Painel) { this.painel.set(p); }
  fechar() { this.painel.set(null); }
}

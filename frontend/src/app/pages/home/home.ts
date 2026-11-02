import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Parque } from '../../core/models/api.models';
import { Api } from '../../core/services/api';
import { HeroParque } from '../../shared/components/hero-parque/hero-parque';

type PainelId = 'funcionamento' | 'como-chegar' | 'estacionamento' | 'mapa';

interface Atalho {
  id: PainelId;
  rotulo: string;
  icone: string;
}

const MAPA_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3602.334372034531!2d-53.8177841!3d-25.460508!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f14d6db34e243d%3A0x6e633cd35854aa8f!2sParque%20Nacional%20Igua%C3%A7u!5e0!3m2!1spt-BR!2sbr!4v1747163159901!5m2!1spt-BR!2sbr';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeroParque],
  templateUrl: './home.html',
})
export class Home {
  readonly atalhos: Atalho[] = [
    { id: 'funcionamento', rotulo: 'Funcionamento', icone: 'bi-clock-fill' },
    { id: 'como-chegar', rotulo: 'Como chegar', icone: 'bi-geo-alt-fill' },
    { id: 'estacionamento', rotulo: 'Estacionamento', icone: 'bi-car-front-fill' },
    { id: 'mapa', rotulo: 'Mapa', icone: 'bi-map-fill' },
  ];
  readonly mapaSeguro: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(MAPA_EMBED_URL);

  painel = signal<PainelId | null>(null);
  parque = signal<Parque | null>(null);

  constructor() {
    inject(Api).parque().subscribe({ next: (dados) => this.parque.set(dados), error: () => undefined });
  }

  abrir(painel: PainelId) {
    this.painel.set(painel);
  }

  fechar() {
    this.painel.set(null);
  }
}

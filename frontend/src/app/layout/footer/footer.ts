import { Component, inject, signal } from '@angular/core';
import { Parque } from '../../core/models/api.models';
import { Api } from '../../core/services/api';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
})
export class Footer {
  parque = signal<Parque | null>(null);

  constructor() {
    inject(Api).parque().subscribe({ next: (dados) => this.parque.set(dados), error: () => undefined });
  }
}

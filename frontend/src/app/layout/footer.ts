import { Component, inject, signal } from '@angular/core';
import { Api, Parque } from '../core/api';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="d-flex justify-content-around">
        <section class="rodape-info">
          <h3>CONTATO</h3>
          <p>E-mail: {{ p()?.contato?.email }}</p>
          <p>Telefone: {{ p()?.contato?.telefone }}</p>
          <p>Whatsapp: {{ p()?.contato?.whatsapp }}</p>
        </section>
        <section class="rodape-info">
          <h3>LOCALIZAÇÃO</h3>
          <p>{{ p()?.localizacao?.endereco }}</p>
          <p>{{ p()?.localizacao?.cidade }}</p>
          <p>CEP.: {{ p()?.localizacao?.cep }}</p>
        </section>
        <section class="rodape-info">
          <h3>REDES SOCIAIS</h3>
          @for (r of p()?.redes; track r.nome) {
            <p><a [href]="r.url" [attr.aria-label]="'Acessar o perfil de ' + r.nome + ' das Cataratas do Iguaçu'" target="_blank" rel="noopener"><i class="bi {{ r.icone }} me-2 text-decoration-none"></i> {{ r.nome }}</a></p>
          }
        </section>
      </div>
      <section class="rodape-autoral mt-4 d-flex justify-content-center text-center">
        <p>&copy; 2025 Parque Nacional do Iguaçu. Feito para fins de estudo (não oficial).</p>
      </section>
    </footer>
  `,
})
export class Footer {
  p = signal<Parque | null>(null);
  constructor() { inject(Api).parque().subscribe({ next: (v) => this.p.set(v), error: () => {} }); }
}

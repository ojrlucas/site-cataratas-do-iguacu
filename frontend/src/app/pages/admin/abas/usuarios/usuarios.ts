import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Papel, UsuarioAdmin } from '../../../../core/models/api.models';
import { Api } from '../../../../core/services/api';
import { Auth } from '../../../../core/services/auth';
import { mensagemErro } from '../../../../core/utils/http-error';

@Component({
  selector: 'app-admin-usuarios',
  imports: [DatePipe],
  host: { class: 'sem-caixa' },
  templateUrl: './usuarios.html',
})
export class AdminUsuarios {
  private api = inject(Api);
  readonly auth = inject(Auth);

  usuarios = signal<UsuarioAdmin[]>([]);
  erro = signal('');

  constructor() {
    this.carregar();
  }

  alterarPapel(usuario: UsuarioAdmin, papel: string) {
    this.erro.set('');
    this.api.adminPapel(usuario.id, papel as Papel).subscribe({
      next: () => this.carregar(),
      error: (erro) => {
        this.erro.set(mensagemErro(erro));
        this.carregar();
      },
    });
  }

  private carregar() {
    this.api.adminUsuarios().subscribe({
      next: (lista) => this.usuarios.set(lista),
      error: (erro) => this.erro.set(mensagemErro(erro)),
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Atividade, AtividadeForm, MensagemResposta, NovoPedido, Papel, Parque, Pedido, PedidoAdmin, PedidoQr,
  Resumo, TipoForm, TipoIngresso, UsuarioAdmin,
} from '../models/api.models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);

  parque = () => this.http.get<Parque>(`${API}/parque`);
  atividades = () => this.http.get<Atividade[]>(`${API}/atividades`);
  tipos = () => this.http.get<TipoIngresso[]>(`${API}/ingressos/tipos`);
  pedidos = () => this.http.get<Pedido[]>(`${API}/pedidos`);
  criarPedido = (pedido: NovoPedido) => this.http.post<Pedido>(`${API}/pedidos`, pedido);
  qrcode = (id: number) => this.http.get<PedidoQr>(`${API}/pedidos/${id}/qrcode`);
  reenviar = (id: number) => this.http.post<MensagemResposta>(`${API}/pedidos/${id}/reenviar`, {});
  esqueciSenha = (email: string) => this.http.post<MensagemResposta>(`${API}/auth/esqueci-senha`, { email });

  adminResumo = () => this.http.get<Resumo>(`${API}/admin/resumo`);
  adminPedidos = () => this.http.get<PedidoAdmin[]>(`${API}/admin/pedidos`);
  adminUsuarios = () => this.http.get<UsuarioAdmin[]>(`${API}/admin/usuarios`);
  adminPapel = (id: number, papel: Papel) => this.http.patch<UsuarioAdmin>(`${API}/admin/usuarios/${id}`, { papel });
  adminTipos = () => this.http.get<TipoIngresso[]>(`${API}/admin/tipos`);

  adminSalvarTipo = (tipo: TipoForm, id?: string) =>
    id
      ? this.http.put<TipoIngresso>(`${API}/admin/tipos/${id}`, tipo)
      : this.http.post<TipoIngresso>(`${API}/admin/tipos`, tipo);

  adminSalvarAtividade = (atividade: AtividadeForm, id?: string) =>
    id
      ? this.http.put<Atividade>(`${API}/admin/atividades/${id}`, atividade)
      : this.http.post<Atividade>(`${API}/admin/atividades`, atividade);

  adminExcluirAtividade = (id: string) => this.http.delete<void>(`${API}/admin/atividades/${id}`);
}

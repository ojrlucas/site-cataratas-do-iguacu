import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Atividade { id: string; titulo: string; imagem: string; alt: string; descricao: string }
export interface TipoIngresso { id: string; nome: string; precoCentavos: number; imagem: string; descricao: string; ativo: boolean }
export interface Pedido {
  id: number; codigo: string; tipoId: string; tipoNome: string; quantidade: number;
  dataVisita: string; totalCentavos: number; emailEnviado: boolean; criadoEm: string;
}
export interface PedidoQr extends Pedido { qrcode: string }
export interface PedidoAdmin extends Pedido { usuarioNome: string; usuarioEmail: string }
export interface UsuarioAdmin { id: number; nome: string; email: string; telefone: string; papel: Papel; criadoEm: string; pedidos: number }
export type Papel = 'usuario' | 'superadmin';
export interface Resumo { usuarios: number; pedidos: number; ingressos: number; receitaCentavos: number; hoje: number }
export interface Parque {
  funcionamento: { aberturaDiaria: string; horarios: { dias: string; horario: string }[] };
  estacionamento: string;
  contato: { email: string; telefone: string; whatsapp: string };
  localizacao: { endereco: string; cidade: string; cep: string };
  redes: { nome: string; icone: string; url: string }[];
}
export type TipoForm = Pick<TipoIngresso, 'nome' | 'precoCentavos' | 'descricao' | 'imagem' | 'ativo'>;
export type AtividadeForm = Pick<Atividade, 'titulo' | 'descricao' | 'imagem'>;

export const IMAGENS_CARD = [1, 2, 3, 4, 5, 6].map((n) => `imagens/lazer-${n}.png`);

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);

  parque = () => this.http.get<Parque>('/api/parque');
  atividades = () => this.http.get<Atividade[]>('/api/atividades');
  tipos = () => this.http.get<TipoIngresso[]>('/api/ingressos/tipos');
  pedidos = () => this.http.get<Pedido[]>('/api/pedidos');
  criarPedido = (b: { tipoId: string; quantidade: number; dataVisita: string }) => this.http.post<Pedido>('/api/pedidos', b);
  qrcode = (id: number) => this.http.get<PedidoQr>(`/api/pedidos/${id}/qrcode`);
  reenviar = (id: number) => this.http.post<{ mensagem: string }>(`/api/pedidos/${id}/reenviar`, {});
  esqueciSenha = (email: string) => this.http.post<{ mensagem: string }>('/api/auth/esqueci-senha', { email });

  adminResumo = () => this.http.get<Resumo>('/api/admin/resumo');
  adminPedidos = () => this.http.get<PedidoAdmin[]>('/api/admin/pedidos');
  adminUsuarios = () => this.http.get<UsuarioAdmin[]>('/api/admin/usuarios');
  adminPapel = (id: number, papel: Papel) => this.http.patch<UsuarioAdmin>(`/api/admin/usuarios/${id}`, { papel });
  adminTipos = () => this.http.get<TipoIngresso[]>('/api/admin/tipos');
  adminSalvarTipo = (b: TipoForm, id?: string) =>
    id ? this.http.put<TipoIngresso>(`/api/admin/tipos/${id}`, b) : this.http.post<TipoIngresso>('/api/admin/tipos', b);
  adminSalvarAtividade = (b: AtividadeForm, id?: string) =>
    id ? this.http.put<Atividade>(`/api/admin/atividades/${id}`, b) : this.http.post<Atividade>('/api/admin/atividades', b);
  adminExcluirAtividade = (id: string) => this.http.delete<void>(`/api/admin/atividades/${id}`);
}

export function mensagemErro(e: unknown, padrao = 'Não foi possível concluir. Tente novamente.'): string {
  return (e as { error?: { erro?: string } })?.error?.erro ?? padrao;
}

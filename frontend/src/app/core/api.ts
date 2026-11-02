import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Atividade { id: string; titulo: string; imagem: string; alt: string; descricao: string }
export interface TipoIngresso { id: string; nome: string; precoCentavos: number; imagem: string; descricao: string }
export interface Pedido { id: number; codigo: string; tipoId: string; tipoNome: string; quantidade: number; dataVisita: string; totalCentavos: number; criadoEm: string }
export interface PedidoQr extends Pedido { qrcode: string }
export interface Parque {
  funcionamento: { aberturaDiaria: string; horarios: { dias: string; horario: string }[] };
  estacionamento: string;
  contato: { email: string; telefone: string; whatsapp: string };
  localizacao: { endereco: string; cidade: string; cep: string };
  redes: { nome: string; icone: string; url: string }[];
}

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  parque = () => this.http.get<Parque>('/api/parque');
  atividades = () => this.http.get<Atividade[]>('/api/atividades');
  tipos = () => this.http.get<TipoIngresso[]>('/api/ingressos/tipos');
  pedidos = () => this.http.get<Pedido[]>('/api/pedidos');
  criarPedido = (b: { tipoId: string; quantidade: number; dataVisita: string }) => this.http.post<Pedido>('/api/pedidos', b);
  qrcode = (id: number) => this.http.get<PedidoQr>(`/api/pedidos/${id}/qrcode`);
  esqueciSenha = (email: string) => this.http.post<{ mensagem: string }>('/api/auth/esqueci-senha', { email });
}

export function mensagemErro(e: any, padrao = 'Não foi possível concluir. Tente novamente.'): string {
  return e?.error?.erro ?? padrao;
}

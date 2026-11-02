export type Papel = 'usuario' | 'superadmin';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  papel: Papel;
}

export interface Sessao {
  token: string;
  usuario: Usuario;
}

export interface Atividade {
  id: string;
  titulo: string;
  imagem: string;
  alt: string;
  descricao: string;
}

export interface TipoIngresso {
  id: string;
  nome: string;
  precoCentavos: number;
  imagem: string;
  descricao: string;
  ativo: boolean;
}

export interface Pedido {
  id: number;
  codigo: string;
  tipoId: string;
  tipoNome: string;
  quantidade: number;
  dataVisita: string;
  totalCentavos: number;
  emailEnviado: boolean;
  criadoEm: string;
}

export interface PedidoQr extends Pedido {
  qrcode: string;
}

export interface PedidoAdmin extends Pedido {
  usuarioNome: string;
  usuarioEmail: string;
}

export interface UsuarioAdmin extends Usuario {
  criadoEm: string;
  pedidos: number;
}

export interface Resumo {
  usuarios: number;
  pedidos: number;
  ingressos: number;
  receitaCentavos: number;
  hoje: number;
}

export interface HorarioFuncionamento {
  dias: string;
  horario: string;
}

export interface RedeSocial {
  nome: string;
  icone: string;
  url: string;
}

export interface Parque {
  funcionamento: { aberturaDiaria: string; horarios: HorarioFuncionamento[] };
  estacionamento: string;
  contato: { email: string; telefone: string; whatsapp: string };
  localizacao: { endereco: string; cidade: string; cep: string };
  redes: RedeSocial[];
}

export interface NovoPedido {
  tipoId: string;
  quantidade: number;
  dataVisita: string;
}

export interface MensagemResposta {
  mensagem: string;
}

export type TipoForm = Pick<TipoIngresso, 'nome' | 'precoCentavos' | 'descricao' | 'imagem' | 'ativo'>;
export type AtividadeForm = Pick<Atividade, 'titulo' | 'descricao' | 'imagem'>;

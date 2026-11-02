export const serializePedido = (p) => ({
  id: p.id,
  codigo: p.codigo,
  tipoId: p.tipo_id,
  tipoNome: p.tipo_nome,
  quantidade: p.quantidade,
  dataVisita: p.data_visita,
  totalCentavos: p.total_centavos,
  emailEnviado: Boolean(p.email_enviado),
  criadoEm: p.criado_em,
});

export const serializePedidoAdmin = (p) => ({
  ...serializePedido(p),
  usuarioNome: p.usuario_nome,
  usuarioEmail: p.usuario_email,
});

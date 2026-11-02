export const serializeUsuario = (u) => ({ id: u.id, nome: u.nome, email: u.email, telefone: u.telefone, papel: u.papel });

export const serializeUsuarioAdmin = (u) => ({ ...serializeUsuario(u), criadoEm: u.criado_em, pedidos: u.pedidos });

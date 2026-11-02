export const serializeAtividade = (a) => ({ id: a.id, titulo: a.titulo, imagem: a.imagem, alt: a.alt, descricao: a.descricao });

export const serializeTipo = (t) => ({
  id: t.id,
  nome: t.nome,
  precoCentavos: t.preco_centavos,
  imagem: t.imagem,
  descricao: t.descricao,
  ativo: Boolean(t.ativo),
});

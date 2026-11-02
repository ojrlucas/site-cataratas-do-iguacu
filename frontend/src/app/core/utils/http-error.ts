interface ErroApi {
  error?: { erro?: string };
}

export function mensagemErro(erro: unknown, padrao = 'Não foi possível concluir. Tente novamente.'): string {
  return (erro as ErroApi)?.error?.erro ?? padrao;
}

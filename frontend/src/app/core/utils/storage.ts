export function lerArmazenado(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function salvarArmazenado(chave: string, valor: string): void {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    return;
  }
}

export function removerArmazenado(chave: string): void {
  try {
    localStorage.removeItem(chave);
  } catch {
    return;
  }
}

export function lerJsonArmazenado<T>(chave: string): T | null {
  try {
    return JSON.parse(lerArmazenado(chave) ?? 'null') as T | null;
  } catch {
    return null;
  }
}

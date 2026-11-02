export function destinoSeguro(url: string | null): string {
  if (!url) return '/';
  const interno = url.startsWith('/') && !url.startsWith('//') && !url.includes('\\');
  return interno ? url : '/';
}

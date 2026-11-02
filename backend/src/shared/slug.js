export function slugify(text) {
  const base = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'item';
}

export function uniqueSlug(text, exists) {
  const base = slugify(text);
  let candidate = base;
  let counter = 2;
  while (exists(candidate)) candidate = `${base}-${counter++}`;
  return candidate;
}

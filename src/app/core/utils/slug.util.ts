export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueSlug(base: string, usedSlugs: string[]): string {
  const raw = slugify(base) || 'item';
  if (!usedSlugs.includes(raw)) return raw;

  let counter = 2;
  let candidate = `${raw}-${counter}`;
  while (usedSlugs.includes(candidate)) {
    counter += 1;
    candidate = `${raw}-${counter}`;
  }

  return candidate;
}

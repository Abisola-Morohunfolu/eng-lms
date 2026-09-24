export const tones: Record<string, string> = {
  'cloud-engineering': 'bg-mist',
  'auth-engineering': 'bg-blush',
  'database-engineering': 'bg-leaf',
};

export function toneFor(slug: string): string {
  return tones[slug] ?? 'bg-mist';
}

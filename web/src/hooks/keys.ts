export const keys = {
  me: ['me'] as const,
  tracks: ['tracks'] as const,
  track: (slug: string) => ['track', slug] as const,
  module: (slug: string) => ['module', slug] as const,
  lesson: (slug: string) => ['lesson', slug] as const,
  progress: ['progress'] as const,
  moduleProgress: (slug: string) => ['module-progress', slug] as const,
};

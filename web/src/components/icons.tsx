const paths: Record<string, string> = {
  'cloud-engineering':
    'M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 8.6 4.5 4.5 0 0 0 7 18Z',
  'auth-engineering':
    'M12 3a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V8a5 5 0 0 0-5-5Zm-3 7V8a3 3 0 1 1 6 0v2H9Z',
  'database-engineering':
    'M12 3C7 3 4 5 4 7s3 4 8 4 8-2 8-4-3-4-8-4Zm8 8c0 2-3 4-8 4s-8-2-8-4m8 8c5 0 8-2 8-4 0 2-3 4-8 4s-8-2-8-4c0 2 3 4 8 4Z',
};

export function TrackIcon({ slug, className }: { slug: string; className?: string }) {
  const d = paths[slug] ?? paths['cloud-engineering'];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

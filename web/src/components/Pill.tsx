import type { ReactNode } from 'react';

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="pill bg-mist text-ink">
      <span className="pill__dot" />
      {children}
    </span>
  );
}

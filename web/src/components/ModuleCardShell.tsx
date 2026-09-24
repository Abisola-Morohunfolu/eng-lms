import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { toneFor } from './tones';

interface ModuleCardShellProps {
  slug: string;
  to?: string;
  children: ReactNode;
}

export function ModuleCardShell({ slug, to, children }: ModuleCardShellProps) {
  const cls = `flex flex-col gap-3 rounded-card p-5 shadow-hard ${toneFor(slug)}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return <div className={cls}>{children}</div>;
}

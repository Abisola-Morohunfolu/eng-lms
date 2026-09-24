import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Button } from './Button';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/progress', label: 'Progress' },
];

export function Nav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <nav className="wrap flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          CDA
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium hover:text-brand">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-ink/60">{user.name ?? user.email}</span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm">
              Sign in
            </Link>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-card border border-ink/15 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-paper md:hidden">
          <div className="wrap flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-card px-3 py-2 text-sm font-medium hover:bg-beige"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={logout}
                className="rounded-card px-3 py-2 text-left text-sm font-medium hover:bg-beige"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-card px-3 py-2 text-sm font-semibold text-brand"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

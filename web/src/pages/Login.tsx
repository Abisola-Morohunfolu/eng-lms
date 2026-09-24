import { useEffect, useState } from 'react';
import { api, googleLoginUrl } from '../api/client';
import { Button } from '../components/Button';

type Health = { status: string; service: string; time: string };

export function Login() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Health>('/health')
      .then(setHealth)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <section className="wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-card border border-ink/10 bg-paper p-8 shadow-hard">
        <p className="text-sm font-semibold text-brand">Engineering Domain Academy</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-ink/70">Sign in to pick up where you left off.</p>

        <div className="mt-6">
          <Button href={googleLoginUrl} className="w-full">
            Sign in with Google
          </Button>
        </div>

        <p className="mt-8 text-xs text-ink/50">
          API:{' '}
          {error ? `unreachable (${error})` : health ? `${health.status} @ ${health.service}` : 'checking…'}
        </p>
      </div>
    </section>
  );
}

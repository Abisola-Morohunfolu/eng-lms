import { useEffect, useState } from 'react';
import { api, googleLoginUrl } from './api/client';

type Health = { status: string; service: string; time: string };

export function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Health>('/health')
      .then(setHealth)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <main
      style={{
        fontFamily: 'ui-serif, Georgia, serif',
        maxWidth: 420,
        margin: '12vh auto',
        padding: '0 20px',
        color: '#111827',
      }}
    >
      <h1 style={{ fontSize: 22 }}>Engineering Domain Academy</h1>
      <p style={{ color: '#6b7280' }}>Sign in to continue your track.</p>

      <a
        href={googleLoginUrl}
        style={{
          display: 'inline-block',
          marginTop: 16,
          padding: '10px 16px',
          background: '#111827',
          color: '#fff',
          borderRadius: 8,
          textDecoration: 'none',
        }}
      >
        Sign in with Google
      </a>

      <p style={{ marginTop: 40, fontSize: 12, color: '#9ca3af' }}>
        API:{' '}
        {error ? `unreachable (${error})` : health ? `${health.status} @ ${health.service}` : 'checking…'}
      </p>
    </main>
  );
}

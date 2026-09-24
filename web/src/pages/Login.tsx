import { googleLoginUrl } from '../api/client';
import { Button } from '../components/Button';

export function Login() {
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
      </div>
    </section>
  );
}

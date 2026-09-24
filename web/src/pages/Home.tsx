import { Button } from '../components/Button';
import { Pill } from '../components/Pill';
import { SubjectCard } from '../components/SubjectCard';
import type { Track } from '../api/types';

const tracks: Track[] = [
  {
    id: 'cloud',
    slug: 'cloud-engineering',
    title: 'Cloud Engineering',
    description:
      'A 10-week, concept-first path across cloud, networking, compute, storage, security, IaC, CI/CD, and reliability.',
    order: 1,
  },
  {
    id: 'auth',
    slug: 'auth-engineering',
    title: 'Authentication & Authorization',
    description:
      'Identity, sessions, tokens, OAuth 2.0 / OIDC, and authorization models for backend engineers.',
    order: 2,
  },
  {
    id: 'db',
    slug: 'database-engineering',
    title: 'Database Engineering',
    description:
      'Relational modeling, indexes and query performance, transactions, and migrations on PostgreSQL.',
    order: 3,
  },
];

export function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-peach/60 blur-2xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-mist/60 blur-2xl" />

        <div className="wrap relative flex flex-col items-center gap-8 py-16 text-center md:py-28">
          <Pill>Cloud · Auth · Databases</Pill>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Learn the <span className="accent scribble">systems</span> behind modern software — by
            building them.
          </h1>
          <p className="max-w-xl text-lg text-ink/70">
            A small, hands-on study path for cloud, authentication, and database engineering. Work
            through modules, check your understanding, and keep track as you go.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/login">Sign in</Button>
            <Button href="#programs" variant="secondary">
              Browse tracks
            </Button>
          </div>
        </div>
      </section>

      <section id="programs" className="bg-beige">
        <div className="wrap flex flex-col gap-10 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Three tracks
            </h2>
            <p className="mt-3 text-ink/70">
              Each track is a set of modules with lessons, a short quiz, and a hands-on checklist.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {tracks.map((track) => (
              <SubjectCard key={track.slug} track={track} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

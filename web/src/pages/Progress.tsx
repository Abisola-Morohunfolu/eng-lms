import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { ProgressResponse } from '../api/types';
import { ProgressBar } from '../components/ProgressBar';

const tones: Record<string, string> = {
  'cloud-engineering': 'bg-mist',
  'auth-engineering': 'bg-blush',
  'database-engineering': 'bg-leaf',
};

export function Progress() {
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<ProgressResponse>('/me/progress')
      .then(setProgress)
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return <p className="wrap py-24 text-center text-ink/60">Couldn’t load progress ({error}).</p>;
  }
  if (!progress) {
    return <p className="wrap py-24 text-center text-ink/60">Loading progress…</p>;
  }

  return (
    <div className="wrap flex flex-col gap-12 py-12 md:py-16">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Track your momentum
        </h1>
        <p className="mt-2 text-ink/70">Per-module scores and checklist completion.</p>
      </header>

      {progress.tracks.map((track) => (
        <section key={track.slug}>
          <div className="mb-4 flex items-center gap-4">
            <h2 className="font-display text-xl font-bold">{track.title}</h2>
            <div className="w-48">
              <ProgressBar value={track.percent} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {progress.modules
              .filter((m) => m.trackSlug === track.slug)
              .map((m) => (
                <div
                  key={m.slug}
                  className={`flex flex-col gap-3 rounded-card p-5 shadow-hard ${tones[track.slug] ?? 'bg-mist'}`}
                >
                  <h3 className="font-display text-lg font-bold leading-snug">{m.title}</h3>
                  <ProgressBar value={m.percent} />
                  <dl className="flex flex-col gap-1 text-sm text-ink/70">
                    <div className="flex justify-between">
                      <dt>Lessons</dt>
                      <dd className="font-semibold tabular-nums">
                        {m.lessonsDone}/{m.lessonsTotal}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Checklist</dt>
                      <dd className="font-semibold tabular-nums">
                        {m.checklistDone}/{m.checklistTotal}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Quiz best</dt>
                      <dd className="font-semibold tabular-nums">
                        {m.quizBestScore === null ? '—' : `${m.quizBestScore}%`}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

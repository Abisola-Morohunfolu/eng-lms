import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Track, TrackDetail } from '../api/types';
import { ProgressBar } from '../components/ProgressBar';
import { TrackIcon } from '../components/icons';

const tones: Record<string, string> = {
  'cloud-engineering': 'bg-mist',
  'auth-engineering': 'bg-blush',
  'database-engineering': 'bg-leaf',
};

export function Dashboard() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [details, setDetails] = useState<Record<string, TrackDetail>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Track[]>('/tracks')
      .then(async (list) => {
        setTracks(list);
        const entries = await Promise.all(
          list.map((t) =>
            api<TrackDetail>(`/tracks/${t.slug}`).then((d) => [t.slug, d] as const),
          ),
        );
        setDetails(Object.fromEntries(entries));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="wrap py-24 text-center text-ink/60">Loading your tracks…</p>;
  }

  if (error) {
    return (
      <p className="wrap py-24 text-center text-ink/60">
        Couldn’t load tracks ({error}).
      </p>
    );
  }

  return (
    <div className="wrap flex flex-col gap-14 py-12 md:py-16">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your tracks</h1>
        <p className="mt-2 text-ink/70">
          Pick a module to open its lessons, quiz, and checklist.
        </p>
      </header>

      {tracks.map((track) => (
        <section key={track.slug}>
          <div className="mb-4 flex items-center gap-3">
            <TrackIcon slug={track.slug} className="h-5 w-5 text-brand" />
            <h2 className="font-display text-xl font-bold">{track.title}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(details[track.slug]?.modules ?? []).map((m) => (
              <Link
                key={m.slug}
                to={`/modules/${m.slug}`}
                className={`flex flex-col gap-3 rounded-card p-5 shadow-hard ${tones[track.slug] ?? 'bg-mist'}`}
              >
                <span className="text-xs font-semibold text-ink/50">
                  Module {String(m.order).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg font-bold leading-snug">{m.title}</h3>
                {m.summary && <p className="text-sm leading-relaxed text-ink/70">{m.summary}</p>}
                <div className="mt-auto pt-2">
                  <ProgressBar value={0} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

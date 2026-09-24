import { ModuleCardShell } from '../components/ModuleCardShell';
import { ProgressBar } from '../components/ProgressBar';
import { Status } from '../components/Status';
import { TrackIcon } from '../components/icons';
import { useGetTrackDetails, useGetTracks } from '../hooks/content';
import { useGetProgress } from '../hooks/progress';

export function Dashboard() {
  const tracksQuery = useGetTracks();
  const progressQuery = useGetProgress();
  const detailsQueries = useGetTrackDetails(tracksQuery.data);

  const isPending =
    tracksQuery.isPending || progressQuery.isPending || detailsQueries.some((q) => q.isPending);
  const isError =
    tracksQuery.isError || progressQuery.isError || detailsQueries.some((q) => q.isError);

  if (isPending) return <Status message="Loading your tracks…" />;
  if (isError) return <Status message="Couldn’t load tracks." />;

  const tracks = tracksQuery.data ?? [];
  const details = Object.fromEntries(
    tracks.map((t, i) => [t.slug, detailsQueries[i]?.data] as const),
  );
  const percent = Object.fromEntries(
    (progressQuery.data?.modules ?? []).map((m) => [m.slug, m.percent]),
  );

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
              <ModuleCardShell key={m.slug} slug={track.slug} to={`/modules/${m.slug}`}>
                <span className="text-xs font-semibold text-ink/50">
                  Module {String(m.order).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg font-bold leading-snug">{m.title}</h3>
                {m.summary && <p className="text-sm leading-relaxed text-ink/70">{m.summary}</p>}
                <div className="mt-auto pt-2">
                  <ProgressBar value={percent[m.slug] ?? 0} />
                </div>
              </ModuleCardShell>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

import { ModuleCardShell } from '../components/ModuleCardShell';
import { ProgressBar } from '../components/ProgressBar';
import { Status } from '../components/Status';
import { useGetProgress } from '../hooks/progress';

export function Progress() {
  const { data: progress, isPending, isError } = useGetProgress();

  if (isPending) return <Status message="Loading progress…" />;
  if (isError || !progress) return <Status message="Couldn’t load progress." />;

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
                <ModuleCardShell key={m.slug} slug={track.slug}>
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
                </ModuleCardShell>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

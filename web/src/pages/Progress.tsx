import { Button } from '../components/Button';

export function Progress() {
  return (
    <div className="wrap py-16 md:py-24">
      <section className="rounded-card bg-forest p-8 text-paper md:p-12">
        <p className="text-sm font-semibold text-paper/60">Progress</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Track your momentum
        </h1>
        <p className="mt-3 max-w-xl text-paper/70">
          Per-module scores and checklist completion arrive with the assessment phase. For now, head
          to the dashboard and work through a track.
        </p>
        <div className="mt-6">
          <Button href="/dashboard">Go to dashboard</Button>
        </div>
      </section>
    </div>
  );
}

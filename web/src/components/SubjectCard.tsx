import { Link } from 'react-router-dom';
import type { Track } from '../api/types';
import { TrackIcon } from './icons';

const tones: Record<string, string> = {
  'cloud-engineering': 'bg-mist',
  'auth-engineering': 'bg-blush',
  'database-engineering': 'bg-leaf',
};

export function SubjectCard({ track }: { track: Track }) {
  const tone = tones[track.slug] ?? 'bg-mist';
  return (
    <Link
      to="/dashboard"
      className={`group flex flex-col gap-4 rounded-card p-6 shadow-hard ${tone}`}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-paper/70 text-ink">
        <TrackIcon slug={track.slug} className="h-6 w-6" />
      </span>
      <div>
        <h3 className="font-display text-xl font-bold">{track.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{track.description}</p>
      </div>
      <span className="mt-auto text-sm font-semibold text-brand">Open track →</span>
    </Link>
  );
}

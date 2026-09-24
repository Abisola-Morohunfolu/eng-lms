import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-forest text-paper">
      <div className="wrap flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-bold">Engineering Domain Academy</p>
          <p className="mt-1 text-sm text-paper/60">
            A hands-on study path for cloud, auth, and database engineering.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-paper/80">
          <Link to="/" className="hover:text-paper">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-paper">
            Dashboard
          </Link>
          <Link to="/progress" className="hover:text-paper">
            Progress
          </Link>
        </div>
      </div>
    </footer>
  );
}

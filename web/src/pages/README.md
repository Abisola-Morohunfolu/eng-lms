# pages (Phase 6)

Wire these with `react-router-dom` (already a dependency) in `App.tsx`.

- `Login` — the "Sign in with Google" screen (currently the whole of `App.tsx`).
- `Dashboard` — calls `GET /me/progress`; shows tracks and module cards with a percent bar. The home after login.
- `Module` — calls `GET /modules/:slug`; renders the lesson markdown, the quiz, and the checklist.
- `Progress` — per-module scores and checklist completion.

Auth: add an `AuthContext` that calls `GET /auth/me` on load; redirect to `Login` when it 401s. Render
markdown with a small library (e.g. `react-markdown`).

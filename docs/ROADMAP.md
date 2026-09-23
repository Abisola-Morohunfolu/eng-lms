# Roadmap

Each phase leaves the app runnable. Check items off in `PROGRESS.md`.

## Phase 0 — Scaffold (done)
Repo, runnable API health endpoint, runnable SPA login page, Prisma schema, seed script, one example quiz.

## Phase 1 — Database
- Create Neon project, set `DATABASE_URL` (see `docs/SETUP.md`).
- `npm run prisma:migrate` then `npm run seed`.
- Verify with `npm run prisma:studio` — you should see 3 tracks, 18 modules, lessons, checklist items.
- Then wire Prisma into the app: import `PrismaModule` in `api/src/app.module.ts`.

## Phase 2 — Auth (Google OAuth)
Follow `api/src/auth/README.md`. End state: `GET /auth/google` logs you in and `GET /auth/me` returns your user.

## Phase 3 — Content API
Follow `api/src/content/README.md`. End state: `GET /tracks`, `/tracks/:slug`, `/modules/:slug`, `/lessons/:slug`
return seeded data (guarded).

## Phase 4 — Frontend pages
Follow `web/src/pages/README.md`. End state: log in with Google → Dashboard lists modules → open a module and
read the lesson.

## Phase 5 — Assessment
Follow `api/src/progress/README.md` and add quiz + checklist UI. End state: submit a quiz (server-scored), tick
checklist items, complete a lesson, and see the dashboard percentages move.

## Phase 6 — Deploy
Follow `docs/DEPLOY.md`. End state: live SPA on Cloudflare Pages talking to the API on Render, Google login
working against the prod redirect URI.

## Phase 7 — Content
Author 3–5 quiz questions per module in `content/quizzes.json` (keyed by module slug, e.g.
`week-02-linux-and-networking`), re-run `npm run seed`.

## System-design notes to write as you go
Keep a short note per phase: the OAuth flow end to end, session cookie vs JWT, CORS across two origins, your
index choices, and how `GET /me/progress` avoids N+1. These notes are the point of the project.

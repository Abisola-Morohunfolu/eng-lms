# Engineering Domain Academy

A minimal, auth-gated learning platform for cloud / infra / DevOps / auth / databases. Built as a learning
vehicle for backend and system design. Content is three tracks — Cloud Engineering (10 modules),
Authentication & Authorization (4 modules), and Database Engineering (4 modules); assessment is a quiz plus a
hands-on checklist per module; progress is tracked per user. Several auth/DB modules tie back to a real NestJS
auth service (Casbin policies, tenant closure tables, advisory-lock migrations).

## Stack

- **web/** — React + Vite + TypeScript SPA. Deploys to Cloudflare Pages.
- **api/** — NestJS 11 REST API. Deploys to Render (free web service).
- **DB** — PostgreSQL on Neon (free tier), via Prisma.
- **Auth** — Google OAuth only; backend mints an httpOnly session cookie.

## Layout

```
api/       NestJS API (health endpoint runnable now; auth/content/progress documented per folder)
web/       Vite React SPA (login page runnable now; dashboard/module pages documented)
content/   tracks.json + curriculum markdown (week-*, auth-*, db-*) + quizzes.json — seeded into the DB
docs/      SETUP, DEPLOY, ROADMAP
PROGRESS.md  Your build tracker
```

## Run it now (health check + login page)

```bash
# API
cd api && cp .env.example .env && npm install && npm run start:dev   # http://localhost:3000/health

# Web (new terminal)
cd web && cp .env.example .env.local && npm install && npm run dev   # http://localhost:5173
```

The web page shows the login screen and reports whether it can reach the API. The Google button and all
content/progress features come online as you work through `docs/ROADMAP.md`.

## What's built vs. what you build

- **Built:** repo scaffold, runnable API health endpoint, runnable SPA login page, full Prisma data model,
  a working seed script that ingests the curriculum, one example quiz.
- **You build (documented):** Google OAuth + session guard (`api/src/auth`), content endpoints
  (`api/src/content`), progress + scoring (`api/src/progress`), the SPA pages (`web/src/pages`), deployment.

Start with `docs/SETUP.md`, then follow `docs/ROADMAP.md` phase by phase.

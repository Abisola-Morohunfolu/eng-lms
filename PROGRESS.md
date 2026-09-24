# Build Progress

Track your own progress building the platform. (Learner progress is tracked in the app itself.)

| Phase | Area | Status | Notes |
| --- | --- | --- | --- |
| 0 | Scaffold | Done | API health + SPA login runnable; schema + seed in place |
| 1 | Database (Neon + Prisma migrate + seed) | Done | Neon migrated + seeded: 3 tracks, 18 modules, 18 lessons, 17 quizzes, 142 checklist items; baselined `0_init` migration |
| 2 | Auth (Google OAuth + session guard) | Done | `api/src/auth` — Google OAuth + httpOnly session cookie + global `SessionGuard` |
| 3 | Content API | Done | `api/src/content` — guarded `/tracks`, `/modules`, `/lessons` |
| 4 | Frontend pages | Done | Home/Login/Dashboard/Module/Progress routed + `AuthContext` |
| 5 | Assessment (quizzes + checklists + dashboard) | Done | Server-scored quizzes, checklist toggles, lesson completion, `/me/progress` aggregation; SPA wired via React Query |
| 6 | Deploy (Render + Cloudflare Pages) | In progress | `render.yaml` Blueprint, auto-seed-on-boot, `_redirects` fallback, migrate-deploy script added; pending: create Render/CF services + prod OAuth URI |
| 7 | Author remaining quiz questions | Done | 3 questions × 17 modules in `content/quizzes.json` (capstone has none) |

## Per-phase reflection
- What did I learn?
- What broke and why?
- One system-design decision I made and the tradeoff.

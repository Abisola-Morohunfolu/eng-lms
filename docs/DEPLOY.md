# Deploy

Free tier throughout. Deploy the DB first, then the API, then the web.

## TL;DR — fill these in first

You need these values before starting (all places are marked with `<...>` placeholders below):

- `<DATABASE_URL>` — Neon connection string (same as local, or a fresh Neon branch for prod).
- `<service-name>` — your Render web service name (e.g. `eda-api`), which determines the API URL
  `https://<service-name>.onrender.com`.
- `<pages-domain>` — your Cloudflare Pages domain (e.g. `eda.pages.dev` or a custom domain).
- `<google-client-id>` / `<google-client-secret>` — your Google OAuth client credentials.

## Database — Neon

Already created in `docs/SETUP.md`. Use the same `DATABASE_URL` in Render, or create a dedicated
production branch. Migrations + seed are applied automatically (see below); no manual steps.

## API — Render (free web service)

This repo ships a `render.yaml` Blueprint at the root. Fastest path:

1. Push this repo to GitHub.
2. Render → **New** → **Blueprint** → connect the repo. Render reads `render.yaml` and creates the
   `eda-api` web service (root dir `api`).
3. Fill the secret env vars in the service dashboard (they're marked `sync: false`, so Render will
   prompt for them):
   - `DATABASE_URL`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL=https://<service-name>.onrender.com/auth/google/callback`
   - `POST_LOGIN_REDIRECT=https://<pages-domain>/dashboard`
   - `WEB_ORIGIN=https://<pages-domain>`
   - `JWT_SECRET` (Render generates one for you via `generateValue: true`)
4. Add `https://<service-name>.onrender.com/auth/google/callback` to Google Cloud → Credentials →
   your OAuth client's authorized redirect URIs.

What the Blueprint does:

- **Build**: `npm install --include=dev && npm run build` (installs dev deps so `prisma generate` +
  `nest build` work, then compiles).
- **Start**: `npm run prisma:deploy && npm run start:prod` — applies pending migrations, then boots.
- **Seed**: the app auto-seeds the curriculum on boot **only when the DB is empty** (see `SeedService`).
  `NODE_ENV=production` and `SEED_ON_BOOT=true` are set in `render.yaml`.

> Note: the free service sleeps after 15 min idle; the first request wakes it (~1 min). Fine for
> personal use.

### Manual setup (no Blueprint)

If you'd rather configure manually:

1. Render → New → Web Service, connect repo, **root directory `api`**.
2. Build command: `npm install --include=dev && npm run build`.
3. Start command: `npm run prisma:deploy && npm run start:prod`.
4. Env vars: `NODE_ENV=production`, `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
   `GOOGLE_CALLBACK_URL=https://<service-name>.onrender.com/auth/google/callback`, `JWT_SECRET`,
   `POST_LOGIN_REDIRECT=https://<pages-domain>/dashboard`, `WEB_ORIGIN=https://<pages-domain>`,
   `SEED_ON_BOOT=true`.

## Web — Cloudflare Pages

1. Cloudflare Pages → connect the repo, root directory `web`.
2. Build command `npm run build`, output directory `dist`.
3. Environment: `VITE_API_BASE=https://<service-name>.onrender.com`.
4. SPA fallback is already provided by `web/public/_redirects` (`/* /index.html 200`); no extra step.

## Cross-origin cookie checklist

Because the SPA and API are on different domains, the session cookie must be `SameSite=None; Secure` in
prod. This is wired up already:

- `api/src/auth/auth.controller.ts` sets `secure: isProd` / `sameSite: isProd ? "none" : "lax"`, where
  `isProd = NODE_ENV === "production"`. **`NODE_ENV=production` must be set on Render** (it is, via
  `render.yaml`) or the cookie silently stays `SameSite=Lax` and login breaks.
- CORS: `app.enableCors({ origin: envs.WEB_ORIGIN, credentials: true })` in `api/src/main.ts` — `WEB_ORIGIN`
  must be the **exact** Pages origin (scheme + host, no trailing slash).
- SPA `fetch` sends `credentials: 'include'` (`web/src/api/client.ts`).

## Verify

1. `https://<service-name>.onrender.com/health` → `{ status: "ok", ... }` (first hit may take ~1 min to
   wake the free service).
2. Open `https://<pages-domain>` → log in with Google → dashboard lists your tracks.
3. Open a module, complete a lesson, answer a quiz, tick a checklist item → dashboard percentages move.

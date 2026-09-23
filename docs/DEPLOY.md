# Deploy

Free tier throughout. Deploy the DB first, then the API, then the web.

## Database — Neon
Already created in `docs/SETUP.md`. Use the same `DATABASE_URL` in Render. Run migrations against it once:
`DATABASE_URL=... npx prisma migrate deploy` (or let the API run it on boot).

## API — Render (free web service)
1. Push this repo to GitHub.
2. Render → New → Web Service → connect the repo, root directory `api`.
3. Build command: `npm install && npm run build`. Start command: `npm run start:prod`.
4. Environment: set `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`,
   `GOOGLE_CALLBACK_URL=https://<service>.onrender.com/auth/google/callback`,
   `WEB_ORIGIN=https://<your-pages-domain>`, `POST_LOGIN_REDIRECT=https://<your-pages-domain>/dashboard`.
5. Add the Render callback URL to Google Cloud → Credentials → your OAuth client.

Note: the free service sleeps after 15 min idle; the first request wakes it (~1 min). Fine for personal use.

## Web — Cloudflare Pages
1. Cloudflare Pages → connect the repo, root directory `web`.
2. Build command `npm run build`, output directory `dist`.
3. Environment: `VITE_API_BASE=https://<service>.onrender.com`.
4. Add an SPA fallback so client routes work: a `web/public/_redirects` file containing `/*  /index.html  200`.

## Cross-origin cookie checklist
Because the SPA and API are on different domains, the session cookie must be `SameSite=None; Secure` in prod,
CORS must set `credentials: true` with the exact `WEB_ORIGIN` (already wired in `api/src/main.ts`), and the SPA
`fetch` must send `credentials: 'include'` (already wired in `web/src/api/client.ts`).

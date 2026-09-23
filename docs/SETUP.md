# Setup

Steps you must do yourself (accounts and secrets). Nothing here is committed.

## 1. Neon Postgres (free)

1. Create a project at https://neon.tech (choose a region near you).
2. Copy the **Prisma** connection string from Connection Details.
3. Put it in `api/.env` as `DATABASE_URL`.
4. From `api/`: `npm run prisma:migrate` (creates the tables), then `npm run seed` (loads the curriculum).

Neon autosuspends when idle; the first query after a pause wakes it (a short delay), which is normal.

## 2. Google OAuth (free)

1. Go to https://console.cloud.google.com → create a project.
2. **APIs & Services → OAuth consent screen**: External, add yourself as a Test user.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application**.
4. Authorized redirect URIs — add both:
   - `http://localhost:3000/auth/google/callback`
   - `https://<your-api>.onrender.com/auth/google/callback` (after you deploy)
5. Copy the Client ID and Client secret into `api/.env` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
6. Generate a session secret: `openssl rand -hex 32` → `JWT_SECRET` in `api/.env`.

You (not any tool) create these credentials and paste the secrets; they never get committed.

## 3. Run locally

```bash
cd api && npm install && npm run start:dev     # :3000
cd web && npm install && npm run dev           # :5173
```

Verify: open http://localhost:3000/health (JSON ok), then http://localhost:5173 (login page reports the API
as reachable).

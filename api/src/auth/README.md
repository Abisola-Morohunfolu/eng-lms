# auth module (Phase 3)

Google OAuth only. The backend owns the OAuth callback and mints an httpOnly session cookie (a JWT inside).

## Build

1. `GoogleStrategy` (`passport-google-oauth20`) — reads `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
   `GOOGLE_CALLBACK_URL`; `validate()` upserts a `User` by `googleId` and returns it.
2. `AuthController`:
   - `GET /auth/google` — `@UseGuards(AuthGuard('google'))`, triggers the redirect to Google.
   - `GET /auth/google/callback` — `@UseGuards(AuthGuard('google'))`, signs a JWT (`sub = user.id`),
     sets it as an httpOnly cookie, redirects to `POST_LOGIN_REDIRECT`.
   - `POST /auth/logout` — clears the cookie.
   - `GET /auth/me` — `@UseGuards(SessionGuard)`, returns the current user.
3. `SessionGuard` — reads the cookie, verifies the JWT with `@nestjs/jwt`, loads the `User` via
   `PrismaService`, attaches it to the request. Protects every content/progress route.

## Cookie settings

httpOnly; `sameSite: 'lax'` and `secure: false` locally; `secure: true` + `sameSite: 'none'` in prod
(SPA and API are on different origins). Cookie name e.g. `eda_session`.

## Wire-up

Add `AuthModule` and `PrismaModule` to `AppModule` imports. See `docs/SETUP.md` for the Google Cloud steps.

# content module (Phase 4)

Read-only endpoints that serve the seeded curriculum. All guarded by `SessionGuard`.

- `GET /tracks` — all tracks, ordered.
- `GET /tracks/:slug` — one track with its modules (ordered).
- `GET /modules/:slug` — one module with its lessons, quiz (questions WITHOUT `correctIndex`), and checklist items.
- `GET /lessons/:slug` — one lesson's `contentMarkdown`.

Never send `correctIndex` to the client on the content path — scoring happens server-side in the progress
module. Use `PrismaService` with `select`/`include` to shape responses.

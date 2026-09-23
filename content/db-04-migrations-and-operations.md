# DB 4: Migrations and Operations

## Summary

Schemas change over time, and those changes must be safe on live, replicated databases. This module covers versioned idempotent migrations, connection pooling, and safe rollbacks.

## Goals

- Understand schema migrations as versioned, ordered, reviewable changes.
- Write idempotent, re-runnable migrations and know why that matters on replicas.
- Learn connection pooling and why serverless Postgres needs it.
- Know the basics of read replicas, backups, and safe rollbacks.

## Core resources

- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Neon: Connection pooling](https://neon.tech/docs/connect/connection-pooling)
- [PostgreSQL: Advisory Locks](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS)

## Exercises

1. Run `npm run prisma:migrate` for this platform and read the generated SQL. Identify the `CREATE TABLE` and the constraints.
2. Explain why a migration that adds a `NOT NULL` column to a large, live table needs a default or a backfill step.
3. Explain why concurrent app instances must not all run migrations at once, and how an advisory lock serializes them (as AudioEye's services do on boot).
4. Describe why Neon's pooled connection string exists and what breaks if many serverless functions each open a direct connection.

## Deliverable

- A short runbook: how to add a column safely, migrate, and roll back if it fails.
- A note on where this platform runs its migrations (local `migrate dev`, prod `migrate deploy`).

## Exit check

You have completed the Database track if you can explain what makes a migration idempotent and why that protects a multi-replica deploy.

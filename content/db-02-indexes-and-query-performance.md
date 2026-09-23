# DB 2: Indexes and Query Performance

## Summary

Indexes turn full-table scans into fast lookups, at a write and storage cost. This module covers B-tree and composite indexes, reading query plans, and avoiding N+1 queries.

## Goals

- Understand how a B-tree index turns a scan into a lookup.
- Learn single-column, composite, and covering indexes, and why column order matters.
- Read a query plan with `EXPLAIN ANALYZE`.
- Recognize the N+1 query problem and how to fix it.

## Core resources

- [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [Use The Index, Luke](https://use-the-index-luke.com/)
- [Prisma: Query optimization](https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance)

## Exercises

1. Explain why `LessonProgress` is indexed on `userId` and why the dashboard query `GET /me/progress` benefits from it.
2. For a query filtering `WHERE userId = ? AND quizId = ?`, decide whether a composite index `(userId, quizId)` helps and why order matters.
3. Run `EXPLAIN ANALYZE` on a seeded query in `prisma studio` or `psql`; identify a sequential scan versus an index scan.
4. Describe an N+1 pattern the progress dashboard could fall into and how a single aggregate query avoids it.

## Deliverable

- A before/after note: one query, its plan without an index, and its plan with one.
- A list of the indexes in the platform schema and the query each one serves.

## Exit check

You are ready for the next module if you can explain why an index speeds reads but taxes writes, and why you do not index every column.

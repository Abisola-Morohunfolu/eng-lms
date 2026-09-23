# DB 3: Transactions and Concurrency

## Summary

Transactions keep multi-step writes all-or-nothing, and isolation levels decide what concurrent transactions can see. This module covers ACID, isolation, and optimistic vs pessimistic concurrency control.

## Goals

- Understand ACID: atomicity, consistency, isolation, durability.
- Learn isolation levels (read committed, repeatable read, serializable) and the anomalies each prevents.
- Compare optimistic (version column / CAS) and pessimistic (row locks) concurrency control.
- Know when a group of writes must be one transaction.

## Core resources

- [PostgreSQL: Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [PostgreSQL: Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [PostgreSQL: Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Prisma: Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)

## Exercises

1. In this platform, a quiz submission writes a `QuizAttempt` and could update a cached score. Explain why both should be one transaction.
2. Describe a lost-update race between two concurrent requests and how a version column (`if_version` compare-and-swap) prevents it.
3. Explain the difference between read committed and serializable using one concrete anomaly.
4. Study AudioEye's cache invalidation: a version counter joins the write's compare-and-swap so a build that started before a change cannot land after it. Explain in your own words why that ordering matters.

## Deliverable

- A note describing one lost-update scenario and two fixes: pessimistic lock vs optimistic version check.
- The exact set of writes in this app you would wrap in a transaction.

## Exit check

You are ready for the next module if you can explain what atomicity guarantees when a transaction fails halfway through.

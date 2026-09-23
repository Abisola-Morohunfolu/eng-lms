# DB 1: Relational Modeling

## Summary

A good schema encodes the rules of your domain. This module covers keys, relationships, normalization, and how to read your own Prisma schema as an entity-relationship model.

## Goals

- Model entities, attributes, and relationships (one-to-one, one-to-many, many-to-many).
- Understand primary keys, foreign keys, and join tables.
- Apply normalization (1NF–3NF) and know when to denormalize on purpose.
- Read and write an entity-relationship diagram.

## Core resources

- [PostgreSQL: Data Definition](https://www.postgresql.org/docs/current/ddl.html)
- [PostgreSQL: Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [Database normalization (Wikipedia)](https://en.wikipedia.org/wiki/Database_normalization)
- [Prisma: Data model](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

## Exercises

1. Draw the ER diagram for this platform from `api/prisma/schema.prisma`: User, Track, Module, Lesson, Quiz, and the progress tables.
2. Identify every relationship type in that schema and the foreign key that implements it.
3. Explain why `LessonProgress` has a unique constraint on `(userId, lessonId)` and what bug that prevents.
4. Take one denormalization you might add (e.g. a cached `percent` on Module) and list the write-time cost it introduces.

## Deliverable

- An ER diagram of the platform schema.
- A short note: one place the schema is normalized and one place you would denormalize for read speed, with the tradeoff.

## Exit check

You are ready for the next module if you can explain what a foreign key guarantees and what a many-to-many join table is for.

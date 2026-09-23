# progress module (Phase 5)

Write + aggregate endpoints. All guarded by `SessionGuard`; `userId` always comes from the session, never the body.

- `POST /lessons/:id/complete` — upsert `LessonProgress` (unique on `userId, lessonId`).
- `POST /quizzes/:id/attempts` — body `{ answers: number[] }`. Load the quiz's questions server-side, compute
  `score`/`total` by comparing each answer to `correctIndex`, store a `QuizAttempt`, return the score + which
  were wrong. This is the only place `correctIndex` is read.
- `POST /checklist-items/:id/toggle` — create or delete a `ChecklistProgress` row.
- `GET /me/progress` — aggregate for the dashboard: per module, `{ lessonsDone/lessonsTotal, quizBestScore,
  checklistDone/checklistTotal, percent }`; per track, the average of its modules. One aggregation query, not N+1.

## Percent rule (suggested)

`module.percent = round(100 * (lessonsDone + quizPassed + checklistDone) / (lessonsTotal + 1 + checklistTotal))`
where `quizPassed` is 1 if best score >= 70%, else 0. Tune later.

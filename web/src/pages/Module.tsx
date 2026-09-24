import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { api } from '../api/client';
import type {
  Lesson,
  ModuleDetail,
  ModuleProgress,
  QuizAttemptResult,
} from '../api/types';

function post<T>(path: string, body: unknown): Promise<T> {
  return api<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function Module() {
  const { slug } = useParams<{ slug: string }>();
  const [module, setModule] = useState<ModuleDetail | null>(null);
  const [lessonSlug, setLessonSlug] = useState<string | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);

  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [quizResult, setQuizResult] = useState<QuizAttemptResult | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api<ModuleDetail>(`/modules/${slug}`)
      .then((m) => {
        setModule(m);
        setSelected(new Array(m.quiz?.questions.length ?? 0).fill(null));
        if (m.lessons[0]) setLessonSlug(m.lessons[0].slug);
      })
      .catch((e: Error) => setError(e.message));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    api<ModuleProgress>(`/modules/${slug}/progress`)
      .then((p) => {
        setCompletedLessonIds(new Set(p.completedLessonIds));
        setCheckedIds(new Set(p.checkedChecklistItemIds));
        setBestScore(p.quizBestScore);
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!lessonSlug) return;
    setLesson(null);
    setLessonError(null);
    api<Lesson>(`/lessons/${lessonSlug}`)
      .then(setLesson)
      .catch((e: Error) => setLessonError(e.message));
  }, [lessonSlug]);

  const activeLessonId = lesson?.id;

  const completeLesson = useCallback(async () => {
    if (!activeLessonId || busy) return;
    setBusy('lesson');
    try {
      await post(`/lessons/${activeLessonId}/complete`, {});
      setCompletedLessonIds((prev) => new Set(prev).add(activeLessonId));
    } finally {
      setBusy(null);
    }
  }, [activeLessonId, busy]);

  const toggleChecklist = useCallback(
    async (itemId: string) => {
      if (busy) return;
      setBusy('checklist');
      try {
        const res = await post<{ checked: boolean }>(
          `/checklist-items/${itemId}/toggle`,
          {},
        );
        setCheckedIds((prev) => {
          const next = new Set(prev);
          if (res.checked) next.add(itemId);
          else next.delete(itemId);
          return next;
        });
      } finally {
        setBusy(null);
      }
    },
    [busy],
  );

  const submitQuiz = useCallback(async () => {
    if (!module?.quiz || busy) return;
    setBusy('quiz');
    try {
      const answers = selected.map((v) => v ?? -1);
      const res = await post<QuizAttemptResult>(
        `/quizzes/${module.quiz.id}/attempts`,
        { answers },
      );
      setQuizResult(res);
      const pct = Math.round((100 * res.score) / res.total);
      setBestScore((prev) => (prev === null ? pct : Math.max(prev, pct)));
    } finally {
      setBusy(null);
    }
  }, [module, selected, busy]);

  const quizComplete = useMemo(
    () => selected.every((v) => v !== null) && selected.length > 0,
    [selected],
  );

  if (error) {
    return <p className="wrap py-24 text-center text-ink/60">Couldn’t load module ({error}).</p>;
  }
  if (!module) {
    return <p className="wrap py-24 text-center text-ink/60">Loading module…</p>;
  }

  return (
    <div className="wrap flex flex-col gap-8 py-12 md:py-16">
      <div>
        <Link to="/dashboard" className="text-sm font-semibold text-brand">
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {module.title}
        </h1>
        {module.summary && <p className="mt-2 max-w-2xl text-ink/70">{module.summary}</p>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Lessons</p>
          <ol className="flex flex-col gap-2">
            {module.lessons.map((l, i) => {
              const active = l.slug === lessonSlug;
              const done = completedLessonIds.has(l.id);
              return (
                <li key={l.slug}>
                  <button
                    onClick={() => setLessonSlug(l.slug)}
                    className={`flex w-full items-center gap-3 rounded-card px-4 py-3 text-left text-sm font-medium transition-colors ${
                      active
                        ? 'bg-forest text-paper'
                        : 'border border-ink/10 bg-paper hover:bg-beige'
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                        active ? 'bg-paper/20' : 'bg-ink/10'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    {l.title}
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <article className="rounded-card border border-ink/10 bg-paper p-6 shadow-hard md:p-8">
          {lessonError ? (
            <p className="text-ink/60">Couldn’t load lesson ({lessonError}).</p>
          ) : lesson ? (
            <>
              <h2 className="font-display text-2xl font-bold tracking-tight">{lesson.title}</h2>
              <div className="md mt-4">
                <Markdown>{lesson.contentMarkdown}</Markdown>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={completeLesson}
                  disabled={completedLessonIds.has(activeLessonId!) || busy === 'lesson'}
                  className={`rounded-pill px-5 py-2 text-sm font-semibold transition-colors ${
                    completedLessonIds.has(activeLessonId!)
                      ? 'bg-leaf text-ink'
                      : 'bg-forest text-paper hover:bg-forest/90'
                  }`}
                >
                  {completedLessonIds.has(activeLessonId!)
                    ? 'Completed ✓'
                    : 'Mark complete'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-ink/60">Loading lesson…</p>
          )}
        </article>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-card bg-blush p-6 shadow-hard">
          <h3 className="font-display text-lg font-bold">Checklist</h3>
          <ul className="mt-4 flex flex-col gap-2">
            {module.checklistItems.map((item) => {
              const checked = checkedIds.has(item.id);
              return (
                <li key={item.id}>
                  <button
                    onClick={() => toggleChecklist(item.id)}
                    className="flex w-full items-start gap-3 text-left text-sm"
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 text-xs font-bold ${
                        checked
                          ? 'border-forest bg-forest text-paper'
                          : 'border-ink/30 bg-paper'
                      }`}
                    >
                      {checked ? '✓' : ''}
                    </span>
                    <span className={checked ? 'text-ink/50 line-through' : ''}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-card bg-leaf p-6 shadow-hard">
          <h3 className="font-display text-lg font-bold">Quiz</h3>
          {bestScore !== null && quizResult === null && (
            <p className="mt-2 text-sm text-ink/70">Best score: {bestScore}%</p>
          )}
          {module.quiz ? (
            <>
              <ol className="mt-4 flex flex-col gap-4">
                {module.quiz.questions.map((q, qi) => (
                  <li key={q.id} className="text-sm">
                    <p className="font-medium">{q.prompt}</p>
                    <ul className="mt-2 flex flex-col gap-1">
                      {q.options.map((opt, oi) => {
                        const isSelected = selected[qi] === oi;
                        const revealed = quizResult !== null;
                        const isCorrect = revealed && quizResult.correct[qi];
                        const wasWrongPick = revealed && isSelected && !quizResult.correct[qi];
                        return (
                          <li key={oi}>
                            <button
                              onClick={() =>
                                setSelected((prev) =>
                                  prev.map((v, i) => (i === qi ? oi : v)),
                                )
                              }
                              disabled={revealed}
                              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                                revealed && isCorrect
                                  ? 'bg-forest/10 ring-1 ring-forest'
                                  : wasWrongPick
                                    ? 'bg-red-100 ring-1 ring-red-400'
                                    : isSelected
                                      ? 'bg-forest text-paper'
                                      : 'bg-paper/60 hover:bg-paper'
                              }`}
                            >
                              <span
                                className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                                  isSelected ? 'border-paper' : 'border-ink/30'
                                }`}
                              />
                              {opt}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ol>
              {quizResult ? (
                <div className="mt-4 rounded-md bg-paper/70 p-3 text-sm font-semibold">
                  You scored {quizResult.score} / {quizResult.total} (
                  {Math.round((100 * quizResult.score) / quizResult.total)}%)
                </div>
              ) : (
                <button
                  onClick={submitQuiz}
                  disabled={!quizComplete || busy === 'quiz'}
                  className="mt-4 rounded-pill bg-forest px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy === 'quiz' ? 'Submitting…' : 'Submit quiz'}
                </button>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-ink/70">No quiz for this module yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

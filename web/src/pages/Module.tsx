import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { Quiz } from '../api/types';
import { Status } from '../components/Status';
import { useGetLesson, useGetModule } from '../hooks/content';
import {
  useCompleteLesson,
  useGetModuleProgress,
  useSubmitQuiz,
  useToggleChecklistItem,
} from '../hooks/progress';

function QuizSection({
  quizId,
  quiz,
  slug,
  bestScore,
}: {
  quizId: string;
  quiz: Quiz;
  slug: string;
  bestScore: number | null;
}) {
  const [selected, setSelected] = useState<(number | null)[]>(
    Array(quiz.questions.length).fill(null),
  );
  const submitQuiz = useSubmitQuiz(quizId, slug);
  const quizResult = submitQuiz.data;
  const quizComplete = selected.every((v) => v !== null) && selected.length > 0;

  return (
    <section className="rounded-card bg-leaf p-6 shadow-hard">
      <h3 className="font-display text-lg font-bold">Quiz</h3>
      {bestScore !== null && quizResult === undefined && (
        <p className="mt-2 text-sm text-ink/70">Best score: {bestScore}%</p>
      )}
      <ol className="mt-4 flex flex-col gap-4">
        {quiz.questions.map((q, qi) => (
          <li key={q.id} className="text-sm">
            <p className="font-medium">{q.prompt}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {q.options.map((opt, oi) => {
                const isSelected = selected[qi] === oi;
                const revealed = quizResult !== undefined;
                const isCorrect = quizResult !== undefined && quizResult.correct[qi];
                const wasWrongPick =
                  quizResult !== undefined && isSelected && !quizResult.correct[qi];
                return (
                  <li key={oi}>
                    <button
                      onClick={() =>
                        setSelected((prev) => prev.map((v, i) => (i === qi ? oi : v)))
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
          onClick={() => submitQuiz.mutate(selected.map((v) => v ?? -1))}
          disabled={!quizComplete || submitQuiz.isPending}
          className="mt-4 rounded-pill bg-forest px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitQuiz.isPending ? 'Submitting…' : 'Submit quiz'}
        </button>
      )}
    </section>
  );
}

export function Module() {
  const { slug } = useParams<{ slug: string }>();
  const moduleQuery = useGetModule(slug);
  const progressQuery = useGetModuleProgress(slug);

  const [lessonSlug, setLessonSlug] = useState<string | null>(null);

  const module = moduleQuery.data;
  const progress = progressQuery.data;
  const activeLessonSlug = lessonSlug ?? module?.lessons[0]?.slug ?? null;
  const lessonQuery = useGetLesson(activeLessonSlug);
  const lesson = lessonQuery.data;

  const completeLesson = useCompleteLesson(slug ?? '');
  const toggleChecklist = useToggleChecklistItem(slug ?? '');

  const completedLessonIds = useMemo(
    () => new Set(progress?.completedLessonIds ?? []),
    [progress],
  );
  const checkedIds = useMemo(() => new Set(progress?.checkedChecklistItemIds ?? []), [progress]);
  const bestScore = progress?.quizBestScore ?? null;
  const activeLessonId = lesson?.id;

  if (moduleQuery.isPending) return <Status message="Loading module…" />;
  if (moduleQuery.isError || !module) return <Status message="Couldn’t load module." />;

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
              const active = l.slug === activeLessonSlug;
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
          {lessonQuery.isPending ? (
            <p className="text-ink/60">Loading lesson…</p>
          ) : lessonQuery.isError || !lesson ? (
            <p className="text-ink/60">Couldn’t load lesson.</p>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold tracking-tight">{lesson.title}</h2>
              <div className="md mt-4">
                <Markdown>{lesson.contentMarkdown}</Markdown>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => completeLesson.mutate(activeLessonId!)}
                  disabled={completedLessonIds.has(activeLessonId!) || completeLesson.isPending}
                  className={`rounded-pill px-5 py-2 text-sm font-semibold transition-colors ${
                    completedLessonIds.has(activeLessonId!)
                      ? 'bg-leaf text-ink'
                      : 'bg-forest text-paper hover:bg-forest/90'
                  }`}
                >
                  {completedLessonIds.has(activeLessonId!)
                    ? 'Completed ✓'
                    : completeLesson.isPending
                      ? 'Marking…'
                      : 'Mark complete'}
                </button>
              </div>
            </>
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
                    onClick={() => toggleChecklist.mutate(item.id)}
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

        {module.quiz ? (
          <QuizSection
            key={module.quiz.id}
            quizId={module.quiz.id}
            quiz={module.quiz}
            slug={slug ?? ''}
            bestScore={bestScore}
          />
        ) : (
          <section className="rounded-card bg-leaf p-6 shadow-hard">
            <h3 className="font-display text-lg font-bold">Quiz</h3>
            <p className="mt-4 text-sm text-ink/70">No quiz for this module yet.</p>
          </section>
        )}
      </div>
    </div>
  );
}

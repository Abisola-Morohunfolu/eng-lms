import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { api } from '../api/client';
import type { Lesson, ModuleDetail } from '../api/types';

export function Module() {
  const { slug } = useParams<{ slug: string }>();
  const [module, setModule] = useState<ModuleDetail | null>(null);
  const [lessonSlug, setLessonSlug] = useState<string | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api<ModuleDetail>(`/modules/${slug}`)
      .then((m) => {
        setModule(m);
        if (m.lessons[0]) setLessonSlug(m.lessons[0].slug);
      })
      .catch((e: Error) => setError(e.message));
  }, [slug]);

  useEffect(() => {
    if (!lessonSlug) return;
    setLesson(null);
    setLessonError(null);
    api<Lesson>(`/lessons/${lessonSlug}`)
      .then(setLesson)
      .catch((e: Error) => setLessonError(e.message));
  }, [lessonSlug]);

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
                      {i + 1}
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
            {module.checklistItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-md border-2 border-ink/30" />
                {item.label}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink/50">Marking items off is coming in a later phase.</p>
        </section>

        <section className="rounded-card bg-leaf p-6 shadow-hard">
          <h3 className="font-display text-lg font-bold">Quiz</h3>
          {module.quiz ? (
            <ol className="mt-4 flex flex-col gap-3">
              {module.quiz.questions.map((q) => (
                <li key={q.id} className="text-sm">
                  <p className="font-medium">{q.prompt}</p>
                  <ul className="mt-2 flex flex-col gap-1 text-ink/70">
                    {q.options.map((opt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-ink/30" />
                        {opt}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-ink/70">No quiz for this module yet.</p>
          )}
          <p className="mt-4 text-xs text-ink/50">Scoring is coming in a later phase.</p>
        </section>
      </div>
    </div>
  );
}

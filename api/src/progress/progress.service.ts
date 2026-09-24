import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

const QUIZ_PASS_THRESHOLD = 70;

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId },
      update: {},
    });

    return { completed: true };
  }

  async submitQuiz(userId: string, quizId: string, answers: number[]) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        questions: {
          orderBy: { order: "asc" },
          select: { correctIndex: true },
        },
      },
    });
    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    const correct = quiz.questions.map((q, i) => answers[i] === q.correctIndex);
    const score = correct.filter(Boolean).length;
    const total = quiz.questions.length;

    await this.prisma.quizAttempt.create({
      data: { userId, quizId, score, total, answers },
    });

    return { score, total, correct };
  }

  async toggleChecklistItem(userId: string, checklistItemId: string) {
    const item = await this.prisma.checklistItem.findUnique({
      where: { id: checklistItemId },
      select: { id: true },
    });
    if (!item) {
      throw new NotFoundException("Checklist item not found");
    }

    const existing = await this.prisma.checklistProgress.findUnique({
      where: {
        userId_checklistItemId: { userId, checklistItemId },
      },
    });

    if (existing) {
      await this.prisma.checklistProgress.delete({
        where: { id: existing.id },
      });
      return { checked: false };
    }

    await this.prisma.checklistProgress.create({
      data: { userId, checklistItemId },
    });
    return { checked: true };
  }

  async getModuleProgress(userId: string, moduleSlug: string) {
    const module = await this.prisma.module.findUnique({
      where: { slug: moduleSlug },
      select: { id: true },
    });
    if (!module) {
      throw new NotFoundException("Module not found");
    }

    const [lessons, checklist, attempts] = await Promise.all([
      this.prisma.lessonProgress.findMany({
        where: { userId, lesson: { moduleId: module.id } },
        select: { lessonId: true },
      }),
      this.prisma.checklistProgress.findMany({
        where: { userId, checklistItem: { moduleId: module.id } },
        select: { checklistItemId: true },
      }),
      this.prisma.quizAttempt.findMany({
        where: { userId, quiz: { moduleId: module.id } },
        select: { score: true, total: true },
      }),
    ]);

    const quizBestScore = attempts.length
      ? Math.max(
          ...attempts.map((a) => Math.round((100 * a.score) / (a.total || 1))),
        )
      : null;

    return {
      completedLessonIds: lessons.map((l) => l.lessonId),
      checkedChecklistItemIds: checklist.map((c) => c.checklistItemId),
      quizBestScore,
      quizAttemptCount: attempts.length,
    };
  }

  async getProgress(userId: string) {
    const [modules, lessonRows, checklistRows, attempts] = await Promise.all([
      this.prisma.module.findMany({
        orderBy: [{ track: { order: "asc" } }, { order: "asc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          track: { select: { slug: true, title: true } },
          quiz: { select: { id: true } },
          _count: { select: { lessons: true, checklistItems: true } },
        },
      }),
      this.prisma.lessonProgress.findMany({
        where: { userId },
        select: { lesson: { select: { moduleId: true } } },
      }),
      this.prisma.checklistProgress.findMany({
        where: { userId },
        select: { checklistItem: { select: { moduleId: true } } },
      }),
      this.prisma.quizAttempt.findMany({
        where: { userId },
        select: {
          score: true,
          total: true,
          quiz: { select: { moduleId: true } },
        },
      }),
    ]);

    const lessonsDone = new Map<string, number>();
    for (const row of lessonRows) {
      const id = row.lesson.moduleId;
      lessonsDone.set(id, (lessonsDone.get(id) ?? 0) + 1);
    }

    const checklistDone = new Map<string, number>();
    for (const row of checklistRows) {
      const id = row.checklistItem.moduleId;
      checklistDone.set(id, (checklistDone.get(id) ?? 0) + 1);
    }

    const bestScore = new Map<string, number>();
    const attemptCount = new Map<string, number>();
    for (const attempt of attempts) {
      const id = attempt.quiz.moduleId;
      attemptCount.set(id, (attemptCount.get(id) ?? 0) + 1);
      const pct = Math.round((100 * attempt.score) / (attempt.total || 1));
      if ((bestScore.get(id) ?? -1) < pct) {
        bestScore.set(id, pct);
      }
    }

    const progressModules = modules.map((m) => {
      const lessonsTotal = m._count.lessons;
      const checklistTotal = m._count.checklistItems;
      const hasQuiz = m.quiz !== null;
      const done = lessonsDone.get(m.id) ?? 0;
      const checked = checklistDone.get(m.id) ?? 0;
      const quizPct = bestScore.get(m.id);
      const quizPassed =
        hasQuiz && quizPct !== undefined && quizPct >= QUIZ_PASS_THRESHOLD
          ? 1
          : 0;
      const denominator = lessonsTotal + (hasQuiz ? 1 : 0) + checklistTotal;
      const numerator = done + quizPassed + checked;
      const percent =
        denominator === 0 ? 0 : Math.round((100 * numerator) / denominator);

      return {
        moduleId: m.id,
        slug: m.slug,
        title: m.title,
        trackSlug: m.track.slug,
        lessonsDone: done,
        lessonsTotal,
        quizBestScore: quizPct ?? null,
        quizAttempts: attemptCount.get(m.id) ?? 0,
        checklistDone: checked,
        checklistTotal,
        percent,
      };
    });

    const trackMap = new Map<
      string,
      { slug: string; title: string; total: number; count: number }
    >();
    for (const m of modules) {
      const key = m.track.slug;
      if (!trackMap.has(key)) {
        trackMap.set(key, {
          slug: key,
          title: m.track.title,
          total: 0,
          count: 0,
        });
      }
    }
    for (const pm of progressModules) {
      const track = trackMap.get(pm.trackSlug)!;
      track.total += pm.percent;
      track.count += 1;
    }

    return {
      tracks: [...trackMap.values()].map((t) => ({
        slug: t.slug,
        title: t.title,
        percent: t.count === 0 ? 0 : Math.round(t.total / t.count),
      })),
      modules: progressModules,
    };
  }
}

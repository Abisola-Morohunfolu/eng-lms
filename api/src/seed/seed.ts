import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type { PrismaClient } from "../generated/prisma";

type TrackDef = {
  prefix: string;
  slug: string;
  title: string;
  description: string;
  order: number;
};

type QuizQ = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

type Sections = Record<string, string>;

const CONTENT_ENV = "CONTENT_DIR";

export function resolveContentDir(): string {
  const candidates = [
    process.env[CONTENT_ENV],
    resolve(process.cwd(), "..", "content"),
    resolve(process.cwd(), "content"),
  ].filter((c): c is string => Boolean(c));

  for (const candidate of candidates) {
    if (existsSync(join(candidate, "tracks.json"))) {
      return candidate;
    }
  }

  throw new Error(
    `Could not locate content directory (looked for tracks.json in: ${candidates.join(", ")})`,
  );
}

function splitSections(md: string): { title: string; sections: Sections } {
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled";
  const sections: Sections = {};
  const parts = md.split(/^##\s+/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const heading = part.slice(0, nl).trim().toLowerCase();
    sections[heading] = part.slice(nl + 1).trim();
  }
  return { title, sections };
}

function toChecklistLabels(...blocks: string[]): string[] {
  return blocks
    .join("\n")
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-*]|\d+\.)\s+/, "").trim())
    .filter((l) => l.length > 0);
}

async function seedModule(
  prisma: PrismaClient,
  contentDir: string,
  quizzes: Record<string, QuizQ[]>,
  trackId: string,
  file: string,
  order: number,
) {
  const md = readFileSync(join(contentDir, file), "utf8");
  const { title, sections } = splitSections(md);
  const slug = file.replace(/\.md$/, "");

  const lessonBody = [
    sections["goals"] ? `## Goals\n\n${sections["goals"]}` : "",
    sections["core resources"]
      ? `## Core resources\n\n${sections["core resources"]}`
      : "",
    sections["exit check"] ? `## Exit check\n\n${sections["exit check"]}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const summary =
    sections["summary"]?.trim() ||
    sections["goals"]?.split("\n")[0]?.trim() ||
    null;

  const module = await prisma.module.upsert({
    where: { slug },
    update: { trackId, title, summary, order },
    create: { trackId, slug, title, summary, order },
  });

  await prisma.lesson.upsert({
    where: { slug: `${slug}-lesson` },
    update: { title, contentMarkdown: lessonBody, order: 1 },
    create: {
      moduleId: module.id,
      slug: `${slug}-lesson`,
      title,
      contentMarkdown: lessonBody,
      order: 1,
    },
  });

  await prisma.checklistItem.deleteMany({ where: { moduleId: module.id } });
  const labels = toChecklistLabels(
    sections["exercises"] ?? "",
    sections["deliverable"] ?? "",
  );
  await prisma.checklistItem.createMany({
    data: labels.map((label, i) => ({
      moduleId: module.id,
      label,
      order: i + 1,
    })),
  });

  const questions = quizzes[slug] ?? [];
  if (questions.length > 0) {
    const quiz = await prisma.quiz.upsert({
      where: { moduleId: module.id },
      update: {},
      create: { moduleId: module.id },
    });
    await prisma.quizQuestion.deleteMany({ where: { quizId: quiz.id } });
    await prisma.quizQuestion.createMany({
      data: questions.map((q, i) => ({
        quizId: quiz.id,
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation ?? null,
        order: i + 1,
      })),
    });
  }
}

export async function seedDatabase(
  prisma: PrismaClient,
  contentDir: string = resolveContentDir(),
): Promise<{ tracks: number; modules: number }> {
  const tracks = JSON.parse(
    readFileSync(join(contentDir, "tracks.json"), "utf8"),
  ) as TrackDef[];
  const quizzes = JSON.parse(
    readFileSync(join(contentDir, "quizzes.json"), "utf8"),
  ) as Record<string, QuizQ[]>;

  const allFiles = readdirSync(contentDir).filter((f) => f.endsWith(".md"));
  let totalModules = 0;

  for (const t of tracks.sort((a, b) => a.order - b.order)) {
    const track = await prisma.track.upsert({
      where: { slug: t.slug },
      update: {
        title: t.title,
        description: t.description,
        order: t.order,
      },
      create: {
        slug: t.slug,
        title: t.title,
        description: t.description,
        order: t.order,
      },
    });

    const files = allFiles.filter((f) => f.startsWith(t.prefix)).sort();
    let order = 1;
    for (const file of files) {
      await seedModule(prisma, contentDir, quizzes, track.id, file, order);
      order += 1;
      totalModules += 1;
    }
  }

  return { tracks: tracks.length, modules: totalModules };
}

export async function seedIfEmpty(
  prisma: PrismaClient,
  contentDir?: string,
): Promise<{ seeded: boolean; tracks: number; modules: number }> {
  const existing = await prisma.track.count();
  if (existing > 0) {
    return { seeded: false, tracks: existing, modules: 0 };
  }

  const result = await seedDatabase(prisma, contentDir);
  return { seeded: true, ...result };
}

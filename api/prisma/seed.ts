import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const CONTENT_DIR = join(__dirname, '..', '..', 'content');

type TrackDef = { prefix: string; slug: string; title: string; description: string; order: number };
type QuizQ = { prompt: string; options: string[]; correctIndex: number; explanation?: string };

const TRACKS = JSON.parse(readFileSync(join(CONTENT_DIR, 'tracks.json'), 'utf8')) as TrackDef[];
const QUIZZES = JSON.parse(readFileSync(join(CONTENT_DIR, 'quizzes.json'), 'utf8')) as Record<string, QuizQ[]>;

type Sections = Record<string, string>;

function splitSections(md: string): { title: string; sections: Sections } {
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
  const sections: Sections = {};
  const parts = md.split(/^##\s+/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const heading = part.slice(0, nl).trim().toLowerCase();
    sections[heading] = part.slice(nl + 1).trim();
  }
  return { title, sections };
}

function toChecklistLabels(...blocks: string[]): string[] {
  return blocks
    .join('\n')
    .split('\n')
    .map((l) => l.replace(/^\s*(?:[-*]|\d+\.)\s+/, '').trim())
    .filter((l) => l.length > 0);
}

async function seedModule(trackId: string, file: string, order: number) {
  const md = readFileSync(join(CONTENT_DIR, file), 'utf8');
  const { title, sections } = splitSections(md);
  const slug = file.replace(/\.md$/, '');

  const lessonBody = [
    sections['goals'] ? `## Goals\n\n${sections['goals']}` : '',
    sections['core resources'] ? `## Core resources\n\n${sections['core resources']}` : '',
    sections['exit check'] ? `## Exit check\n\n${sections['exit check']}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const summary = sections['summary']?.trim() || sections['goals']?.split('\n')[0]?.trim() || null;

  const module = await prisma.module.upsert({
    where: { slug },
    update: { trackId, title, summary, order },
    create: { trackId, slug, title, summary, order },
  });

  await prisma.lesson.upsert({
    where: { slug: `${slug}-lesson` },
    update: { title, contentMarkdown: lessonBody, order: 1 },
    create: { moduleId: module.id, slug: `${slug}-lesson`, title, contentMarkdown: lessonBody, order: 1 },
  });

  await prisma.checklistItem.deleteMany({ where: { moduleId: module.id } });
  const labels = toChecklistLabels(sections['exercises'] ?? '', sections['deliverable'] ?? '');
  await prisma.checklistItem.createMany({
    data: labels.map((label, i) => ({ moduleId: module.id, label, order: i + 1 })),
  });

  const questions = QUIZZES[slug] ?? [];
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

async function main() {
  const allFiles = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  let totalModules = 0;

  for (const t of TRACKS.sort((a, b) => a.order - b.order)) {
    const track = await prisma.track.upsert({
      where: { slug: t.slug },
      update: { title: t.title, description: t.description, order: t.order },
      create: { slug: t.slug, title: t.title, description: t.description, order: t.order },
    });

    const files = allFiles.filter((f) => f.startsWith(t.prefix)).sort();
    let order = 1;
    for (const file of files) {
      await seedModule(track.id, file, order);
      order += 1;
      totalModules += 1;
    }
    console.log(`Track "${track.title}": ${files.length} modules.`);
  }

  console.log(`Seeded ${TRACKS.length} tracks, ${totalModules} modules.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  listTracks() {
    return this.prisma.track.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        order: true,
      },
    });
  }

  async getTrack(slug: string) {
    const track = await this.prisma.track.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        order: true,
        modules: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            slug: true,
            title: true,
            summary: true,
            order: true,
          },
        },
      },
    });

    if (!track) {
      throw new NotFoundException("Track not found");
    }

    return track;
  }

  async getModule(slug: string) {
    const module = await this.prisma.module.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        order: true,
        trackId: true,
        lessons: {
          orderBy: { order: "asc" },
          select: { id: true, slug: true, title: true, order: true },
        },
        quiz: {
          select: {
            id: true,
            questions: {
              orderBy: { order: "asc" },
              select: { id: true, prompt: true, options: true, order: true },
            },
          },
        },
        checklistItems: {
          orderBy: { order: "asc" },
          select: { id: true, label: true, order: true },
        },
      },
    });

    if (!module) {
      throw new NotFoundException("Module not found");
    }

    return module;
  }

  async getLesson(slug: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        order: true,
        moduleId: true,
        contentMarkdown: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    return lesson;
  }
}

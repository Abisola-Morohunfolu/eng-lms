import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import type { User } from "../generated/prisma";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";
import { ProgressService } from "./progress.service";

@Controller()
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Post("lessons/:id/complete")
  completeLesson(@CurrentUser() user: User, @Param("id") lessonId: string) {
    return this.progress.completeLesson(user.id, lessonId);
  }

  @Post("quizzes/:id/attempts")
  submitQuiz(
    @CurrentUser() user: User,
    @Param("id") quizId: string,
    @Body() body: SubmitQuizDto,
  ) {
    return this.progress.submitQuiz(user.id, quizId, body.answers);
  }

  @Post("checklist-items/:id/toggle")
  toggleChecklistItem(
    @CurrentUser() user: User,
    @Param("id") checklistItemId: string,
  ) {
    return this.progress.toggleChecklistItem(user.id, checklistItemId);
  }

  @Get("me/progress")
  getProgress(@CurrentUser() user: User) {
    return this.progress.getProgress(user.id);
  }

  @Get("modules/:slug/progress")
  getModuleProgress(@CurrentUser() user: User, @Param("slug") slug: string) {
    return this.progress.getModuleProgress(user.id, slug);
  }
}

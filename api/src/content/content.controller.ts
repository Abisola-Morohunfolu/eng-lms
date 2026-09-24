import { Controller, Get, Param } from "@nestjs/common";
import { ContentService } from "./content.service";

@Controller()
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get("tracks")
  listTracks() {
    return this.content.listTracks();
  }

  @Get("tracks/:slug")
  getTrack(@Param("slug") slug: string) {
    return this.content.getTrack(slug);
  }

  @Get("modules/:slug")
  getModule(@Param("slug") slug: string) {
    return this.content.getModule(slug);
  }

  @Get("lessons/:slug")
  getLesson(@Param("slug") slug: string) {
    return this.content.getLesson(slug);
  }
}

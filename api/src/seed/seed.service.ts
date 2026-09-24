import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { seedIfEmpty } from "./seed";

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    if (process.env.SEED_ON_BOOT === "false") {
      this.logger.log("SEED_ON_BOOT=false — skipping auto-seed.");
      return;
    }

    try {
      const result = await seedIfEmpty(this.prisma);
      if (result.seeded) {
        this.logger.log(
          `Database was empty — seeded ${result.tracks} tracks, ${result.modules} modules.`,
        );
      } else {
        this.logger.log(
          `Database already has ${result.tracks} tracks — skipping seed.`,
        );
      }
    } catch (err) {
      this.logger.error(
        "Auto-seed failed",
        err instanceof Error ? err.stack : err,
      );
    }
  }
}

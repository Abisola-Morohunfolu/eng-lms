import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./common/prisma.module";
import { ContentModule } from "./content/content.module";
import { HealthController } from "./health/health.controller";
import { ProgressModule } from "./progress/progress.module";
import { SeedModule } from "./seed/seed.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ContentModule,
    ProgressModule,
    SeedModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

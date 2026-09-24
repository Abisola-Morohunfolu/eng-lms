import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";

@Controller("health")
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: "ok", service: "eda-api", time: new Date().toISOString() };
  }
}

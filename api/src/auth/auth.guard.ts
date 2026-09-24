import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { envs } from "../common/config";
import { PrismaService } from "../common/prisma.service";
import type { User } from "../generated/prisma";
import { IS_PUBLIC_KEY } from "./decorators/public.decorator";

interface JwtPayload {
  sub: string;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    const cookies = req.cookies as Record<string, string> | undefined;
    const token = cookies?.[envs.SESSION_COOKIE_NAME];

    if (!token) {
      throw new UnauthorizedException("Missing session cookie");
    }

    let user: User | null;
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    } catch {
      throw new UnauthorizedException("Invalid or expired session");
    }

    if (!user) {
      throw new UnauthorizedException("Unknown user");
    }

    (req as Request & { user: User }).user = user;
    return true;
  }
}

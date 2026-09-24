import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../common/prisma.service";
import { OAuthUser } from "./oauth.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  upsertFromOAuth(user: OAuthUser) {
    return this.prisma.user.upsert({
      where: { googleId: user.providerId },
      update: {
        email: user.email,
        name: user.fullName,
        avatarUrl: user.picture ?? null,
      },
      create: {
        googleId: user.providerId,
        email: user.email,
        name: user.fullName,
        avatarUrl: user.picture ?? null,
      },
    });
  }

  signSession(userId: string) {
    return this.jwt.signAsync({ sub: userId });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}

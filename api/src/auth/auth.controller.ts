import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { CookieOptions, Request, Response } from "express";
import { envs, isProd } from "../common/config";
import type { User } from "../generated/prisma";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import type { OAuthUser } from "./oauth.type";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleLogin() {
    // Passport redirects to Google.
  }

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const oauthUser = req.user as OAuthUser;
    const user = await this.auth.upsertFromOAuth(oauthUser);
    const token = await this.auth.signSession(user.id);

    res.cookie(envs.SESSION_COOKIE_NAME, token, cookieOptions);
    return res.redirect(302, envs.POST_LOGIN_REDIRECT);
  }

  @Get("me")
  me(@CurrentUser() user: User) {
    return user;
  }

  @Public()
  @Post("logout")
  logout(@Res() res: Response) {
    res.clearCookie(envs.SESSION_COOKIE_NAME, { path: "/" });
    return res.json({ ok: true });
  }
}

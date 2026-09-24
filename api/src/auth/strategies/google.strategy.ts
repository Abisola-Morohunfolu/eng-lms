import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {
  Strategy as GoogleStrategyBase,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import { envs } from "../../common/config";
import { OAuthUser } from "../oauth.type";

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleStrategyBase,
  "google",
) {
  constructor() {
    super({
      clientID: envs.GOOGLE_CLIENT_ID,
      clientSecret: envs.GOOGLE_CLIENT_SECRET,
      callbackURL: envs.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
  ): OAuthUser {
    const email = this.getPrimaryEmail(profile);

    if (!email) {
      throw new UnauthorizedException("Google account has no verified email");
    }

    return {
      provider: "google",
      providerId: profile.id,
      email,
      fullName:
        `${profile.name?.givenName ?? ""} ${profile.name?.familyName ?? ""}`.trim(),
      picture: this.getProfilePicture(profile),
    };
  }

  private getPrimaryEmail(profile: GoogleProfile): string {
    const email = profile.emails?.[0];

    if (!email?.verified) {
      throw new UnauthorizedException(`Email ${email?.value} is not verified`);
    }

    return email.value;
  }

  private getProfilePicture(profile: GoogleProfile): string | undefined {
    return profile.photos?.[0]?.value;
  }
}

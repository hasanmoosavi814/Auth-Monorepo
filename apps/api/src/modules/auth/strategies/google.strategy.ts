import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import { ConfigType } from "@nestjs/config";

import googleAuthConfig from "src/config/google-auth.config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleAuthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleAuthConfig>,
    private readonly authService: AuthService
  ) {
    super({
      clientID: googleConfig.clientID!,
      clientSecret: googleConfig.clientSecret!,
      callbackURL: googleConfig.callbackURL!,
      scope: ["email", "profile"],
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      name: profile.displayName,
      password: "",
    });
    done(null, user);
  }
}

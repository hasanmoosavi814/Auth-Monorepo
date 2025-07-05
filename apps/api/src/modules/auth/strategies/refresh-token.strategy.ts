import { ExtractJwt, Strategy } from "passport-jwt";
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthJwtPayload } from "src/common/types/auth-jwtPayload";
import { AuthService } from "../services/auth.service";
import { ConfigType } from "@nestjs/config";
import { Request } from "express";

import refreshConfig from "src/config/refresh.config";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
      secretOrKey: refreshTokenConfig.secret!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub;
    const refreshToken = req.body.refresh;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string) {
    if (!email) throw new UnauthorizedException("Email is required!");
    if (!password) throw new UnauthorizedException("Password is required!");
    return await this.authService.validateLocalUser(email, password);
  }
}

import { RefreshStrategy } from "./strategies/refresh-token.strategy";
import { AuthController } from "./controllers/auth.controller";
import { GoogleStrategy } from "./strategies/google.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserModule } from "../user/user.module";
import { RolesGuard } from "src/common/guards/role.guard";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

import googleAuthConfig from "src/config/google-auth.config";
import refreshConfig from "src/config/refresh.config";
import jwtConfig from "src/config/jwt.config";

@Module({
  imports: [
    UserModule,
    PrismaModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleAuthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    RefreshStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard }, //@UseGuards(JwtAuthGuard)
    { provide: APP_GUARD, useClass: RolesGuard }, //@UseGuards(RolesGuard)
  ],
})
export class AuthModule {}

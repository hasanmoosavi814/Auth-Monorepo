import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { AuthJwtPayload } from "src/common/types/auth-jwtPayload";
import { CreateUserDto } from "../../user/dto/user.dto";
import { hash, verify } from "argon2";
import { UserService } from "src/modules/user/services/user.service";
import { AuthMessage } from "../enum/message.enum";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Role } from "generated/prisma";

import refreshConfig from "src/config/refresh.config";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) throw new ConflictException(AuthMessage.USER_ALREADY_EXISTS);
    return this.userService.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException(AuthMessage.USER_NOT_FOUND);
    const isPasswordMatched = await verify(user.password, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException(AuthMessage.INVALID_CREDENTIALS);
    return { id: user.id, name: user.name, role: user.role };
  }

  async loginUser({
    userId,
    name,
    role,
  }: {
    userId: number;
    name?: string;
    role: Role;
  }) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);
    return { id: userId, name, role, accessToken, refreshToken };
  }

  async generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return { accessToken, refreshToken };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException(AuthMessage.UNAUTHORIZED);
    const currentUser = { id: user.id, role: user.role };
    return currentUser;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException(AuthMessage.UNAUTHORIZED);
    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken
    );
    if (!refreshTokenMatched)
      throw new UnauthorizedException(AuthMessage.INVALID_REFRESH_TOKEN);
    return { id: user.id };
  }

  async refreshToken(userId: number, name: string) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);
    return { id: userId, name, accessToken, refreshToken };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }

  async signOut(userId: number) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }
}

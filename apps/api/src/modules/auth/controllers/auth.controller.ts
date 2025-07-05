import { Get, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RefreshAuthGuard } from "src/common/guards/refresh-auth.guard";
import { Body, Controller } from "@nestjs/common";
import { GoogleAuthGuard } from "src/common/guards/google-auth.guard";
import { LocalAuthGuard } from "src/common/guards/auth.guard";
import { CreateUserDto } from "../../user/dto/user.dto";
import { AuthService } from "../services/auth.service";
import { Response } from "express";
import { Public } from "src/common/decorators/public.decorator";
import { Roles } from "src/common/decorators/role.decorator";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("signin")
  @ApiOperation({ summary: "Sign in user" })
  @ApiResponse({ status: 201, description: "User Sign in successfully" })
  async loginUser(@Request() req) {
    const { id, name, role } = req.user;
    const { accessToken, refreshToken } = await this.authService.loginUser({
      userId: id,
      name,
      role,
    });
    return { user: { id, name, role }, accessToken, refreshToken };
  }

  @Roles("ADMIN", "EDITOR")
  @Get("protected")
  getAll(@Request() req) {
    return {
      message: `Now you can access this protected API. this is your user ID:${req.user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("google/login")
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  async googleCallback(@Request() req, @Res() res: Response) {
    // console.log("Google User", req.user);
    const { id, name, role } = req.user;
    const response = await this.authService.loginUser({
      userId: id,
      name,
      role,
    });
    res.redirect(
      `http://localhost:3000/api/auth/google/callback?` +
        new URLSearchParams({
          userId: String(response.id),
          name: response.name ?? "",
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          role: response.role,
        }).toString()
    );
  }

  @Post("signout")
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }
}

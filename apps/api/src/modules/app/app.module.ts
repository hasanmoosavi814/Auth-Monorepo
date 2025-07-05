import { PrismaService } from "../prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

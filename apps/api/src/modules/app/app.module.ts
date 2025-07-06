import { PrismaService } from "../prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { UploadModule } from "../upload/upload.module";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    UploadModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

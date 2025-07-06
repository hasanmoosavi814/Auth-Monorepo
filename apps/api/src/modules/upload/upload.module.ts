import { UploadController } from "./controllers/upload.controller";
import { AuthModule } from "../auth/auth.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}

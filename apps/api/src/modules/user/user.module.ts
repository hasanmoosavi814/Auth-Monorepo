import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

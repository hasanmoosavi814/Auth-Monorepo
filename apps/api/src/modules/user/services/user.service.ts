import { PrismaService } from "src/modules/prisma/prisma.service";
import { CreateUserDto } from "../dto/user.dto";
import { Injectable } from "@nestjs/common";
import { hash } from "argon2";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    return await this.prisma.user.create({
      data: { password: hashedPassword, ...user },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOne(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async updateHashedRefreshToken(userId: number, hashedRT: string | null) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedRT },
    });
  }
}

import { Module } from '@nestjs/common';
import { GuardService } from './guard.service';
import { GuardController } from './guard.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from 'src/file/file.service';

@Module({
  providers: [GuardService,PrismaService,FileService],
  controllers: [GuardController]
})
export class GuardModule {}

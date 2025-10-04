import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports :[PrismaModule],
  controllers: [RoleController],
  providers: [RoleService, PrismaService],
})

export class RoleModule {}


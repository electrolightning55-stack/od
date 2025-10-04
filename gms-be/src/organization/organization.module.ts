import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { FileModule } from 'src/file/file.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [FileModule],
  providers: [OrganizationService, UserService, RoleService, PrismaService],
  controllers: [OrganizationController]
})
export class OrganizationModule {}

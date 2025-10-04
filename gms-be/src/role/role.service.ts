import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { RolesEnum } from 'src/common/enums/roles-enum';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  /** CREATE ROLE */
  async create(roleName: string): Promise<Role> {
    const existing = await this.prisma.role.findFirst({ where: { roleName } });
    if (existing) throw new ConflictException(`Role '${roleName}' already exists`);
    return this.prisma.role.create({ data: { roleName } });
  }

  /** GET ALL ROLES */
  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany({});
  }

  /** GET ROLES FOR ORGANIZATION (exclude system roles) */
  async findForOrganization(): Promise<Role[]> {
    return this.prisma.role.findMany({
      where: {
        roleName: {
          notIn: [
            RolesEnum.superAdmin,
            RolesEnum.organizationAdmin,
            RolesEnum.guard,
            RolesEnum.client,
          ],
        },
      },
    });
  }

  /** GET ROLE BY ID */
  async findOne(id: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  /** GET ROLE BY NAME */
  async findByName(roleName: string): Promise<Role | null> {
    return this.prisma.role.findFirst({ where: { roleName } });
  }

  /** UPDATE ROLE */
  async update(id: string, roleName?: string): Promise<Role> {
    const existing = await this.prisma.role.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Role with ID ${id} not found`);
    return this.prisma.role.update({
      where: { id },
      data: { ...(roleName && { roleName }) },
    });
  }

  /** DELETE ROLE */
  async remove(id: string): Promise<Role> {
    const existing = await this.prisma.role.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Role with ID ${id} not found`);
    return this.prisma.role.delete({ where: { id } });
  }
}

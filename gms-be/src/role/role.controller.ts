import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role-guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RolesEnum } from 'src/common/enums/roles-enum';

@ApiTags('roles')
@ApiBearerAuth('jwt')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles(RolesEnum.superAdmin)
  @ResponseMessage('Role created successfully')
  create(@Body('roleName') roleName: string) {
    return this.roleService.create(roleName);
  }

  @Get()
  @Roles(RolesEnum.superAdmin)
  @ResponseMessage('Roles fetched successfully')
  findAll() {
    return this.roleService.findAll();
  }

  @Get('organization')
  @Roles(RolesEnum.superAdmin, RolesEnum.organizationAdmin)
  @ResponseMessage('Roles fetched successfully')
  findForOrganization() {
    return this.roleService.findForOrganization();
  }

  @Get(':id')
  @Roles(RolesEnum.superAdmin)
  @ResponseMessage('Role fetched successfully')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.superAdmin)
  @ResponseMessage('Role updated successfully')
  update(@Param('id') id: string, @Body('roleName') roleName: string) {
    return this.roleService.update(id, roleName);
  }

  @Delete(':id')
  @Roles(RolesEnum.superAdmin)
  @ResponseMessage('Role deleted successfully')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}

import { Controller, Post, Get, Param, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GuardCategoryService } from './guard-category.service';
import { CreateGuardCategoryDto } from './dto/create-guard-category.dto';
import { UpdateGuardCategoryDto } from './dto/update-guard-category.dto';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role-guard';
import { RolesEnum } from 'src/common/enums/roles-enum';

@ApiTags('Guard Categories')
@Controller('guard-category')
export class GuardCategoryController {
  constructor(private service: GuardCategoryService) {}

  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Guard Category created successfully')
  create(@Body() dto: CreateGuardCategoryDto, @GetOrganizationId() organizationId : string) {
    return this.service.create(dto,organizationId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("by-organization")
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Guard Category fetched successfully')
  findAllByOrganization(@GetOrganizationId() organizationId : string) {
    return this.service.findAllByOrganizationId(organizationId);
  }

  @Get(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Guard Category fetched successfully')
  findOne(@Param('id') id: string, @GetOrganizationId() organizationId : string) {
    return this.service.findOne(id,organizationId);
  }

  @Patch(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Guard Category updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateGuardCategoryDto, @GetOrganizationId() organizationId : string) {
    return this.service.update(id, dto, organizationId );
  }

  @Delete(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Guard Category deleted successfully')
  remove(@Param('id') id: string, @GetOrganizationId() organizationId : string) {
    return this.service.remove(id, organizationId);
  }
}

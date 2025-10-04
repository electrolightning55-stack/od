
  // ...existing code...
import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards,
    Req,
    Query,
  } from '@nestjs/common';
  import { GuardService } from './guard.service';
import { CreateGuardDto } from './dto/create-guard-dto';
import { UpdateGuardDto } from './dto/update-guard-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role-guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { AssignGuardDto } from './dto/assigned-guard-dto';
import { AssignSupervisorDto } from '../employee/dto/assign-supervisor.dto';
import { RolesEnum } from 'src/common/enums/roles-enum';
  
@ApiTags("Guards")
@Controller('guards')
export class GuardController {
  constructor(private readonly guardService: GuardService) {}

  @Post('bulk-upload')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Bulk guard upload')
  async bulkUpload(
    @GetOrganizationId() organizationId: string,
    @Body() body: { officeId: string, guards: any[] }
  ) {
    return this.guardService.bulkUploadGuards(organizationId, body.officeId, body.guards);
  }

  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Guard created successfully')
  create(@Body() createGuardDto: CreateGuardDto, @GetOrganizationId() organizationId: string) {
    return this.guardService.create(createGuardDto, organizationId);
  }

  // @Get()
  // findAll() {
  //   return this.guardService.findAll();
  // }

  @Get('/by-organization')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Guard fetched successfully')
  findAllByOrganizationId(@GetOrganizationId() organizationId: string) {
    return this.guardService.findGuardsByOrganizationId(organizationId);
  }

  @Get(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Guard fetched successfully')
  findOne(@Param('id') id: string, @GetOrganizationId() organizationId: string) {
    return this.guardService.findOne(id,organizationId);
  }

  @Get('/by/serviceNumber/')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Guard fetched successfully')
  findByServiceNumber(@Query('serviceNumber') serviceNumber: number, @GetOrganizationId() organizationId: string) {
    return this.guardService.findByServiceNumber(serviceNumber,organizationId);
  }


  @Patch(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Guard updated successfully')
  update(@Param('id') id: string, @Body() updateGuardDto: UpdateGuardDto) {
    return this.guardService.update(id, updateGuardDto);
  }

  @Delete(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Guard deleted successfully')
  remove(@Param('id') id: string) {
    return this.guardService.remove(id);
  }

  //#region : ASSIGN GUARD
    @Post('promote-to-supervisor/:guardId')
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolesEnum.organizationAdmin)
    @ResponseMessage('Guard promoted to supervisor successfully')
    async promoteGuardToSupervisor(
      @Param('guardId') guardId: string,
      @Body() dto: AssignSupervisorDto,
      @GetOrganizationId() organizationId: string
    ) {
      return this.guardService.promoteGuardToSupervisor(guardId, dto, organizationId);
    }
  @Post('assign-guard')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Guard assigned successfully')
  assignGuardToLocation(@Body() dto: AssignGuardDto, @GetOrganizationId()  organizationId : string ) {
    return this.guardService.assignGuard(dto,organizationId);
  }

  @Get('assigned-guard/:guardId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Assigned Guard fetched successfully')
  getAssignedGuardByGuardId(@Param("guardId") guardId: string, @GetOrganizationId() organizationId : string ) {
    return this.guardService.getAssignedGuardByGuardId(guardId, organizationId);
  }


  //# SPECIAL APIS
  @Get('with/assigned-locations')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Guards fetched successfully')
  findGuardsWithAssignedLocations(@GetOrganizationId() organizationId : string ) {
    return this.guardService.findGuardsWithAssignedLocations(organizationId);
  }
  //#endregion
}

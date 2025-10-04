import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards,
    Req,
  } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role-guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { UpdateLocationDto } from './dto/update-location.dto';
  
@ApiTags("Location")
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Location created successfully')
  create(@Body() createLocationDto: CreateLocationDto, @GetOrganizationId() organizationId: string) {
    return this.locationService.create(createLocationDto, organizationId);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get('/by-organization')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Location fetched successfully')
  findAllByOrganizationId(@GetOrganizationId() organizationId: string) {
    return this.locationService.findByOrganizationId(organizationId);
  }

  @Get('/by-client/:clientId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Location fetched successfully')
  findAllByClientId(@Param("clientId") clientId : string , @GetOrganizationId() organizationId: string) {
    return this.locationService.findByClientId(clientId,organizationId);
  }

  @Get('/assigned-guard/:locationId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Guards fetched successfully')
  findAssignedGuardByLocation(@Param("locationId") locationId : string , @GetOrganizationId() organizationId: string) {
    return this.locationService.findAssignedGuardByLocation(locationId,organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }


  @Patch(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Location updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateLocationDto, @GetOrganizationId() organizationId: string ) {
    return this.locationService.update(id, dto, organizationId);
  }

  @Delete(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin) 
  @ResponseMessage('Location deleted successfully')
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }

  @Get("requested-guards/:locationId")
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("organizationAdmin")
  @ResponseMessage('Requested guard fetched successfully')
  getRequestedGuardsByLocation(@Param("locationId") locationId: string ) {
    return this.locationService.getRequestedGuardsByLocationId(locationId);
  }
}

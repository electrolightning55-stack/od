import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards,
    Req,
    Query,
  } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role-guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { AssignSupervisorDto } from './dto/assign-supervisor.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateAssignSupervisorDto } from './dto/update-assign-supervisor.dto';
  
@ApiTags("Employee")
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin) 
  create(@Body() createGuardDto: CreateEmployeeDto, @GetOrganizationId() organizationId: string) {
    return this.employeeService.create(createGuardDto, organizationId);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('/by-organization')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  findAllByOrganizationId(@GetOrganizationId() organizationId: string) {
    return this.employeeService.findEmployeeByOrganizationId(organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Get("/get/supervisors")
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  find(@GetOrganizationId() organizationId: string) {
    return this.employeeService.findAllSupervisors(organizationId);
  }


  @Patch(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin) 
  update(@Param('id') id: string, @Body() updateGuardDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateGuardDto);
  }

  @Delete(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin) 
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }

  //region: ASSIGN SUPERVISOR

    @Get("get-assigned-supervisors/:employeeId")
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolesEnum.organizationAdmin)
    @ResponseMessage("Assigned supervisors fetched successfully") 
    getAssignedSupervisor(@Param("employeeId") employeeId : string, @GetOrganizationId() organizationId: string) {
      return this.employeeService.getAssignedSupervisorsByEmployeeId(employeeId, organizationId);
    }


    @Post("assign-supervisor")
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolesEnum.organizationAdmin)
    @ResponseMessage("Supervisor assigned successfully") 
    assignSupervisor(@Body() assignSupervisorDto: AssignSupervisorDto, @GetOrganizationId() organizationId: string) {
      return this.employeeService.assignSupervisor(assignSupervisorDto, organizationId);
    }

    @Patch("update-assigned-supervisor/:assignedSupervisorId")
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolesEnum.organizationAdmin)
    @ResponseMessage("Assigned Supervisor updated successfully") 
    updateSupervisor( @Query("assignedSupervisorId") id : string , @Body() dto: UpdateAssignSupervisorDto, @GetOrganizationId() organizationId: string) {
      return this.employeeService.updateAssignedSupervisor(dto,id,organizationId);
    }
    //endregion
}

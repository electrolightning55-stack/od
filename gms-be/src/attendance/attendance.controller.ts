import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role-guard';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';
import { CreateGuardAttendanceDto } from './dto/create-guard-attendance.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateGuardAttendanceDto } from './dto/update-guard-attendance.dto';

@ApiTags("Attendance")
@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService : AttendanceService){}
    
     @Post("/guard")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Guard Attendance created successfully") 
     @ApiBody({ 
        type: CreateGuardAttendanceDto,
        isArray: true 
      })
     create(@Body() dtoList: CreateGuardAttendanceDto[], @GetOrganizationId() organizationId: string) {
       return this.attendanceService.create(dtoList, organizationId);
     }

    //  @Patch("/guard/update")
    //  @ApiBearerAuth('jwt')
    //  @UseGuards(JwtAuthGuard, RolesGuard)
    //  @Roles(RolesEnum.organizationAdmin)
    //  @ResponseMessage("Guard Attendance created successfully") 
    //  @ApiBody({ 
    //     type: UpdateGuardAttendanceDto,
    //     isArray: true 
    //   })
    //  update(@Body() dtoList: UpdateGuardAttendanceDto[], @GetOrganizationId() organizationId: string) {
    //    return this.attendanceService.update(dtoList, organizationId);
    //  }
   
     @Get("/guard/all")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Guard Attendance fetched successfully")
     findAll(@GetOrganizationId() organizationId: string) {
       return this.attendanceService.findAll(organizationId);
     }

     @Get("/location/guard/:locationId")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Guard Attendance fetched successfully")
     @ApiQuery({ name: 'serviceNumber', required: false, type: Number })
     @ApiQuery({ name: 'officeId', required: false, type: Number })
     findGuardAttendanceByLocationId(
      @GetOrganizationId() organizationId: string,
      @Param("locationId") locationId : string,
      @Query("from") from: Date,
      @Query("to") to: Date,
      @Query("serviceNumber") serviceNumber?: number,
      @Query("officeId") officeId?: string,
    ) {
       return this.attendanceService.findGuardAttendanceByLocationId(locationId,organizationId,from,to,serviceNumber,officeId);
     }
     
   
    
       
    //  @Get('/by-organization')
    //  @ApiBearerAuth('jwt')
    //  @UseGuards(JwtAuthGuard, RolesGuard)
    //  @Roles(RolesEnum.organizationAdmin)
    //  findAllByOrganizationId(@GetOrganizationId() organizationId: string) {
    //    return this.attendanceService.findEmployeeByOrganizationId(organizationId);
    //  }
   
    //  @Get(':id')
    //  findOne(@Param('id') id: string) {
    //    return this.attendanceService.findOne(id);
    //  }
   
   
    //  @Patch(':id')
    //  @ApiBearerAuth('jwt')
    //  @UseGuards(JwtAuthGuard, RolesGuard)
    //  @Roles(RolesEnum.organizationAdmin) 
    //  update(@Param('id') id: string, @Body() updateGuardDto: UpdateEmployeeDto) {
    //    return this.attendanceService.update(id, updateGuardDto);
    //  }
   
     @Delete('/guard/:id')
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin) 
     @ResponseMessage("Guard Attendance deleted successfully")
     remove(@Param('id') id: string) {
       return this.attendanceService.deleteGuardAttendance(id);
     } 
}

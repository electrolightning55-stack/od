import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { ApiBearerAuth, ApiQuery, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role-guard';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { CreateGuardAllowanceDto } from './dto/create-guard-allowance.dto';
import { CreateLocationPayRollDto } from './dto/create-location-payroll-duration.dto';
import { UpdateLocationPayRollDto } from './dto/update-location-payroll.dto';
import { TransferQueryDto } from './dto/transfer-query-dto';
import { TransferType } from 'src/common/enums/transfer-enum';

@Controller('payroll')
export class PayrollController {
    constructor(private readonly payrollService : PayrollService ){}

     @Get("/lock/status/:locationId")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("PayRoll lock fetched successfully")
     geAttendanceLockStatus(
      @Query("startDate") startDate : Date, 
      @Param("locationId") locationId : string, 
     ) {
       return this.payrollService.getAttendanceLockStatus(startDate,locationId);
     }
     
     @Get("/lock/all")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("PayRoll locks fetched successfully")
     getAllAttendanceLocks() {
       return this.payrollService.getAllAttendanceLocks();
     }


     @Post("/lock/attendance-for-payroll")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("PayRoll locked successfully")
     lockAttendance(
      @GetOrganizationId() organizationId : string,
      @Body() dto : CreateLocationPayRollDto 
     ) {
       return this.payrollService.lockAttendance(dto,organizationId);
     } 

     @Patch("/lock/update/:id")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("PayRoll lock updated successfully")
     deletlockAttendance(
      @Param("id") id : string, 
      @Body() dto : UpdateLocationPayRollDto, 
     ) {
       return this.payrollService.updateAttendanceLock(id,dto);
     } 

     
     @Delete("/lock/delete/:id")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("PayRoll lock deleted successfully")
     deletelockAttendance(
      @Param("id") id: string, 
     ) {
       return this.payrollService.deleteAttendanceLock(id);
     } 
    
     
     @Get("/allowance/guard/:locationId")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Guard fetched successfully")
     @ApiQuery({ name: 'officeId', required: false, type: String })
     @ApiQuery({ name: 'serviceNumber', required: false, type: Number })
     findGuardAllowanceForPayroll(
      @Param("locationId") locationId : string, 
      @Query("from") from: Date,
      @Query("to") to: Date,
      @GetOrganizationId() organizationId: string,
      @Query("officeId") officeId? : string, 
      @Query("serviceNumber") serviceNumber? : number, 
     ) {
       return this.payrollService.findGuardAllowanceForPayRoll(locationId,organizationId,from,to,officeId,serviceNumber);
     }   


     @Post("/create/guard/allowance")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Guard allowances created successfully")
     @ApiBody({ 
             type: CreateGuardAllowanceDto,
             isArray: true 
      })
     createGuardAllowance(
      @Body() dtoList : CreateGuardAllowanceDto[], 
      @GetOrganizationId() organizationId: string,
     ) {
       return this.payrollService.createGuardAllowance(dtoList,organizationId);
     }
     
     @Get("/guard-allowance/all")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Guard allowances fetched successfully")
     getAllGuardAllowance() {
       return this.payrollService.getAllGuardAllowance();
     }

     @Delete("/delete/guard-allowance/:id")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Guard allowances deleted successfully")
     deleteGuardAllowance(
       @Param("id") id : string, 
     ) {
       return this.payrollService.deleteGuardAllowance(id);
     }


     @Get("/location/gross-salary/:locationId")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Location Gross Payroll fetched successfully")
     @ApiQuery({ name: 'officeId', required: false, type: String })
     @ApiQuery({ name: 'serviceNumber', required: false, type: Number })
     findLocationGrossPayRoll(
      @Param("locationId") locationId : string, 
      @Query("from") from: Date,
      @Query("to") to: Date,
      @GetOrganizationId() organizationId: string,
      @Query("officeId") officeId? : string, 
      @Query("serviceNumber") serviceNumber? : number, 
     ) {
       return this.payrollService.generateLocationGrossPayRoll(locationId,organizationId,from,to,officeId,serviceNumber);
     } 
     
    
    //  @Get("/guard/:guardId")
    //  @ApiBearerAuth('jwt')
    //  @UseGuards(JwtAuthGuard, RolesGuard)
    //  @Roles(RolesEnum.organizationAdmin)
    //  @ResponseMessage("Guard Payroll fetched successfully")
    //  findLocationAttendance(
    //   @Param("guardId") guardId : string, 
    //   @Query("date") date: Date,
    //   @Query("totalDays") totalDays: number, 
    //   @GetOrganizationId() organizationId: string,
    //   @Param("officeId") officeId? : string, 
    // ) {
    //    return this.payrollService.findGuardAttendanceByGuardId(guardId,organizationId,officeId,totalDays,date);
    //  }


     @Get("/guard-deductions/:locationId")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ApiQuery({ name: 'officeId', required: false, type: String })
     @ApiQuery({ name: 'serviceNumber', required: false, type: Number })
     @ResponseMessage("Guards Deductions fetched successfully")
     findLocationAttendance(
      @Param("locationId") locationId : string, 
      @Query("from") from: Date,
      @Query("to") to: Date,
      @GetOrganizationId() organizationId: string,
      @Query("officeId") officeId? : string, 
      @Query("serviceNumber") serviceNumber? : number, 
      ) {
       return this.payrollService.getGuardsDeductions(locationId,organizationId,from,to,officeId,serviceNumber);
     }


     @Get("/location/net-payable/:locationId")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Location Net Payable Payroll fetched successfully")
     @ApiQuery({ name: 'officeId', required: false, type: String })
     @ApiQuery({ name: 'serviceNumber', required: false, type: Number })
     findLocationNetPayRoll(
      @Param("locationId") locationId : string, 
      @Query("from") from: Date,
      @Query("to") to: Date,
      @GetOrganizationId() organizationId: string,
      @Query("officeId") officeId? : string, 
      @Query("serviceNumber") serviceNumber? : number, 
     ) {
       return this.payrollService.generateLocationNetPayRoll(locationId,organizationId,from,to,officeId,serviceNumber);
     }

     @Get("/location/transfers/")
     @ApiOperation({ summary :"for testing" })
     @ResponseMessage("Transfers processed successfully")
     locationTransfersTesting(
      @Query("username") username: string,
     ) {
       return this.payrollService.processTransferTesting(username);
     }
     
     
     @Get("/location/transfers/:locationId")
     @ApiBearerAuth('jwt')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(RolesEnum.organizationAdmin)
     @ResponseMessage("Transfers fetched successfully")
     @ApiQuery({ name: 'bankId', required: false, type: String })
     locationTransfers(
      @Param("locationId") locationId : string, 
      @Query("transferType") transferType : string, 
      @Query("from") from: Date,
      @Query("to") to: Date,
      @GetOrganizationId() organizationId: string,
      @Query("bankId") bankId? : string, 
     ) {
       return this.payrollService.processBankTransfer(organizationId,locationId,transferType,from,to,bankId);
     }
}

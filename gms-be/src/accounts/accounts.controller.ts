import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGuardDeductionDto } from './dto/create-guard-deductions.dto';
import { AccountsService } from './accounts.service';
import { RolesGuard } from 'src/common/guards/role-guard';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateGuardDeductionDto } from './dto/update-guard-deductions.dto';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {

    constructor(private accountsService: AccountsService) {}

    @Post("/guard-deduction/create")
    @ApiBearerAuth("jwt")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(RolesEnum.organizationAdmin)
    @ResponseMessage("Guard deductions created successfully")
    async createGuardDeduction( @Body() dto : CreateGuardDeductionDto){
        return await this.accountsService.createGuardDeductions(dto);
    }

    @Get("/guard-deduction/all")
    @ApiOperation({ summary :"for testing" })
    @ApiBearerAuth("jwt")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(RolesEnum.organizationAdmin)
    async getAllGuardDeductions(){
        return await this.accountsService.getAllGuardDeductions();
    }

    @Patch("/guard-deduction/:id")
    @ApiBearerAuth("jwt")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(RolesEnum.organizationAdmin)
    async updateGuardDeductions(@Param("id") id : string, @Body() dto : UpdateGuardDeductionDto ){
        return await this.accountsService.updateGuardDeduction(id , dto);
    }

    @Delete("/guard-deduction/:id")
    @ApiBearerAuth("jwt")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(RolesEnum.organizationAdmin)
    async deleteGuardDeductions(@Param("id")  id : string){
        return await this.accountsService.deleteGuardDeductions(id);
    }



}

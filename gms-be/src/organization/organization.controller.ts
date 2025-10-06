import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role-guard';

import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';
import { CreateOfficeDto } from './dto/create-office-dto';
import { CreateOrganizationBankAccountDto } from './dto/create-bank-account.dto';

// Define explicit type for service response
import { ApiResponseProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiResponseProperty()
  success!: boolean;

  @ApiResponseProperty()
  data!: T;

  @ApiResponseProperty()
  message?: string;
}

export class UserDataDto {
  @ApiResponseProperty()
  id!: string;

  @ApiResponseProperty()
  email!: string;

  @ApiResponseProperty()
  userName!: string;

  @ApiResponseProperty()
  roleName!: string;

  @ApiResponseProperty()
  organizationId!: string;

  @ApiResponseProperty({ type: [String] })
  features!: string[];

  @ApiResponseProperty()
  isSuperAdmin!: boolean;
}

export class OrganizationDataDto {
  @ApiResponseProperty()
  id!: string;

  @ApiResponseProperty()
  name!: string;

  @ApiResponseProperty({ type: [String] })
  features!: string[];
}

export class CreateOrganizationResponseDto extends BaseResponseDto<{
  user: UserDataDto;
  organization: OrganizationDataDto;
}> {}

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('register')
  @ResponseMessage('Organization registered successfully')
  async create(@Body() dto: CreateOrganizationDto): Promise<BaseResponseDto> {
    try {
      console.log('[OrgController] Creating org with features:', dto.features);
      const serviceResult = await this.organizationService.create(dto);
      
      const result: BaseResponseDto = {
        success: true,
        data: serviceResult,
        message: 'Organization created successfully'
      };
      
      return result;
    } catch (error) {
      console.error('[OrgController] Organization creation failed:', error);
      throw error;
    }
  }


  @Post('offices')
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Office created successfully')
  async addOffice(
    @Body() dto: CreateOfficeDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<BaseResponseDto<any>> {
    console.log("Add office route hit", { organizationId, payload: dto });
    try {
      const serviceResult = await this.organizationService.addOffice(dto, organizationId);
      return {
        success: true,
        data: serviceResult,
        message: 'Office created successfully'
      };
    } catch (error) {
      console.error("Error in addOffice controller:", error);
      return {
        success: false,
        data: null,
        message: error?.message || 'Failed to create office'
      };
    }
  }

  @Post('bank-accounts')
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Bank Account added successfully')
  async addBankAccount(
    @Body() dto: CreateOrganizationBankAccountDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<BaseResponseDto<any>> {
    const serviceResult = await this.organizationService.addBankAccount(dto, organizationId);
    return {
      success: true,
      data: serviceResult,
      message: 'Bank account added successfully'
    };
  }

  @Get('offices')
  @Get('get-offices') // Add alias for frontend compatibility
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Offices fetched successfully')
  async getOffices(
    @GetOrganizationId() organizationId: string,
  ): Promise<BaseResponseDto<any>> {
    console.log('[OrganizationController] Getting offices', {
      organizationId,
      endpoint: 'GET /organizations/offices',
      role: RolesEnum.organizationAdmin
    });
    const serviceResult = await this.organizationService.getOffices(organizationId);
    return {
      success: true,
      data: serviceResult,
      message: 'Offices fetched successfully'
    };
  }

  @Get('bank-accounts')
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Bank Accounts fetched successfully')
  async getAllBankAccounts(
    @GetOrganizationId() organizationId: string,
  ): Promise<BaseResponseDto<any>> {
    const serviceResult = await this.organizationService.getAllBankAccounts(organizationId);
    return {
      success: true,
      data: serviceResult,
      message: 'Bank accounts fetched successfully'
    };
  }

  @Delete('offices/:id')
  @Roles(RolesEnum.organizationAdmin)
  @ResponseMessage('Office deleted successfully')
  async deleteOffice(
    @Param('id') id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<BaseResponseDto<any>> {
    const serviceResult = await this.organizationService.deleteOffice(id, organizationId);
    return {
      success: true,
      data: serviceResult,
      message: 'Office deleted successfully'
    };
  }

  @Get(':id')
  @Roles(RolesEnum.superAdmin)
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<any>> {
    const serviceResult = await this.organizationService.findOne(id);
    return {
      success: true,
      data: serviceResult,
      message: 'Organization found'
    };
  }

  @Patch(':id')
  @Roles(RolesEnum.superAdmin)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<BaseResponseDto<any>> {
    const serviceResult = await this.organizationService.update(id, dto);
    return {
      success: true,
      data: serviceResult,
      message: 'Organization updated successfully'
    };
  }

  @Delete(':id')
  @Roles(RolesEnum.superAdmin)
  async remove(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<any>> {
    const serviceResult = await this.organizationService.remove(id);
    return {
      success: true,
      data: serviceResult,
      message: 'Organization deleted successfully'
    };
  }



}

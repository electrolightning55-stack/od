import { PartialType } from '@nestjs/mapped-types';
import { AssignSupervisorDto } from './assign-supervisor.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateAssignSupervisorDto  {

      @ApiProperty()
      @IsOptional()
      @IsUUID()
      locationId: string;
    
      @ApiProperty()
      @IsOptional()
      @IsUUID()
      employeeId: string;
    
      @ApiProperty()
      @IsOptional()
      @IsUUID()
      clientId: string;
    
      @ApiPropertyOptional()
      @IsOptional()
      @IsDateString()
      deploymentTill: string;

      @ApiPropertyOptional()
      @IsOptional()
      @IsBoolean()
      isActive: true;

      
}

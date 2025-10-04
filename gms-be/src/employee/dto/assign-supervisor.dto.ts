import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AssignSupervisorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  locationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  guardId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsDateString()
  // deploymentTill: string;
  
}

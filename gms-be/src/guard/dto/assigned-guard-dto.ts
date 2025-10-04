import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AssignGuardDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  requestedGuardId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  guardId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  locationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  guardCategoryId: string;

  //  @ApiProperty()
  //  @IsNotEmpty()
  //  @IsDateString()
  //  deploymentDate: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsDateString()
  // deploymentTill: string;
  
}

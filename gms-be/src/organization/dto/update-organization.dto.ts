import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
import { CreateOfficeDto } from './create-office-dto';

export class UpdateOrganizationDto {
  @ApiProperty()
  @IsString()
  organizationName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationLogo?: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  phoneNumber1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber2?: string;

  @ApiProperty()
  @IsString()
  addressLine1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ type: [CreateOfficeDto] })
  @IsOptional()
  office?: CreateOfficeDto[];
}

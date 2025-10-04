import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsDateString, IsEmail, IsOptional, Matches, IsInt, IsNumber, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClientDto {
  // @ApiProperty() @IsUUID()  organizationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{1,15}$/, { message: 'Contract number must contain 1-15 digits' })
  @Transform(({ value }) => value ? value.toString() : undefined)
  contractNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contractFile?: string;

  @ApiProperty() @IsDate() recruitmentDate: Date;

  @ApiProperty() @IsString()  companyName: string;

  @ApiProperty() @IsString()  industry: string;

  @ApiProperty() @IsString()  websiteLink: string;

  @ApiProperty() @IsString()  address: string;

  @ApiProperty() @IsString()  city: string;

  @ApiProperty() @IsString()  state: string;

  @ApiProperty() @IsString()  country: string;

  @ApiProperty() @IsString()  currentAddress: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'Contact number must be exactly 11 digits' })
  contactNumber: string;

  @ApiProperty()
  @IsEmail()
  officialEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  POCName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  POCDesignation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  POCEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'POC contact number must be exactly 11 digits' })
  POCContact: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  AlternateContactPerson: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'Alternate contact number must be exactly 11 digits' })
  AlternateContactNumber: string;
}

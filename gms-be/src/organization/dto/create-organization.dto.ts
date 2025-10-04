import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MinLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { CreateOfficeDto } from './create-office-dto';

export class CreateOrganizationDto {
  @IsString()
  @IsOptional()
  organizationId?: string;

  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @IsString()
  @IsOptional()
  organizationLogo?: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber1: string;

  @IsString()
  @IsOptional()
  phoneNumber2?: string;

  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  office?: CreateOfficeDto[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  features: string[];
}

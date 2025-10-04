import {
    IsString, IsUUID, IsDateString, IsOptional, IsNumber,
    ValidateNested, IsArray, IsBoolean,
    IsEmail,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAcademicDto, CreateBankAccountDto, CreateBiometricDto, CreateDrivingLicenseDto, CreateReferenceDto } from 'src/guard/dto/create-guard-dto';
  

export class CreateEmployeeExperienceDto {
    @ApiPropertyOptional() @IsOptional() @IsNumber() totalYears: number;
    @ApiPropertyOptional() @IsOptional() @IsString() placeOfDuty: string;
    @ApiPropertyOptional() @IsOptional() @IsString() recentCivilEmployment: string;
  }

  export class CreateEmployeeDocumentsDto {
    @IsOptional() @IsUUID() employeeId?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() picture: string;
    @ApiPropertyOptional() @IsOptional() @IsString() cnicFront: string;
    @ApiPropertyOptional() @IsOptional() @IsString() cnicBack: string;
    @ApiPropertyOptional() @IsOptional() @IsString() licenseFront: string;
    @ApiPropertyOptional() @IsOptional() @IsString() licenseBack: string;
  }  
  
  export class CreateEmployeeDto {
    @ApiPropertyOptional() @IsOptional() @IsDateString() registrationDate: string;
  
    @ApiProperty() @IsString() fullName: string;
    // @ApiProperty() @IsEmail()  email: string;
    // @ApiProperty() @IsString() password: string;
    // @ApiProperty() @IsString() roleName: string;

    @ApiPropertyOptional() @IsString() fatherName: string;
    @ApiPropertyOptional() @IsDateString() dateOfBirth: string;
    @ApiPropertyOptional() @IsOptional() @IsString() cnicNumber: string;
    @ApiPropertyOptional() @IsOptional() @IsDateString() cnicIssueDate: string;
    @ApiPropertyOptional() @IsOptional() @IsDateString() cnicExpiryDate: string;
  
    @ApiPropertyOptional() @IsOptional() @IsString() currentAddress: string;
    @ApiPropertyOptional() @IsOptional() @IsString() permanentAddress: string;
    @ApiPropertyOptional() @IsOptional() @IsString() serviceNumber?: number;
  
  
    @ApiPropertyOptional() @IsOptional() @IsString() religion: string;
    @ApiPropertyOptional() @IsOptional() @IsString() religionSect: string;
    @ApiPropertyOptional() @IsOptional() @IsNumber() weight: number;
    @ApiPropertyOptional() @IsOptional() @IsNumber() height: number;
    @ApiPropertyOptional() @IsOptional() @IsString() bloodGroup: string;
    @ApiPropertyOptional() @IsOptional() @IsString() bloodPressure: string;
    @ApiPropertyOptional() @IsOptional() @IsString() heartBeat: string;
    @ApiPropertyOptional() @IsOptional() @IsString() eyeColor: string;
    @ApiPropertyOptional() @IsOptional() @IsString() contactNumber: string

  
    @ApiPropertyOptional() @IsOptional() @IsString() disability?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() eobiNumber?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() sessiNumber?: string;
  
    @ApiPropertyOptional() @IsOptional() @IsString() kinName: string;
    @ApiPropertyOptional() @IsOptional() @IsString() kinFatherName: string;
    @ApiPropertyOptional() @IsOptional() @IsString() kinRelation: string;
    @ApiPropertyOptional() @IsOptional() @IsString() kinCNIC: string;
    @ApiPropertyOptional() @IsOptional() @IsString() kinContactNumber: string;
  
    @ApiPropertyOptional({ type: () => CreateAcademicDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAcademicDto)
    academic?: CreateAcademicDto;
  
    @ApiPropertyOptional({ type: () => CreateDrivingLicenseDto })
    @IsOptional()
    @ValidateNested() 
    @Type(() => CreateDrivingLicenseDto)
    drivingLicense?: CreateDrivingLicenseDto;
  
    @ApiPropertyOptional({ type: [CreateEmployeeExperienceDto] })
    @IsOptional()
    @ValidateNested()
    @IsArray() @Type(() => CreateEmployeeExperienceDto)
    employeeExperience?: CreateEmployeeExperienceDto[];
  
    @ApiPropertyOptional({ type: [CreateReferenceDto] })
    @IsOptional()
    @ValidateNested()
    @IsArray() @Type(() => CreateReferenceDto)
    references?: CreateReferenceDto[];
  
    @ApiPropertyOptional({ type: () => CreateBankAccountDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateBankAccountDto)
    bankAccount?: CreateBankAccountDto;

    @ApiPropertyOptional({ type: () => CreateEmployeeDocumentsDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateEmployeeDocumentsDto )
    employeeDocuments?: CreateEmployeeDocumentsDto;
  
    @ApiPropertyOptional({ type: () => CreateBiometricDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateBiometricDto)
    biometric?: CreateBiometricDto;
  }
  
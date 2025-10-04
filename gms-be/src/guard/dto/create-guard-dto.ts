import {
    IsString, IsUUID, IsDateString, IsOptional, IsNumber,
    ValidateNested, IsArray, IsBoolean,
    IsInt,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class CreateAcademicDto {
    @ApiPropertyOptional() @IsOptional() @IsString() lastEducation: string;
    @ApiPropertyOptional() @IsOptional() @IsString() institute: string;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() hasDrivingLicense: boolean;
  }
  
  export class CreateDrivingLicenseDto {
    @ApiPropertyOptional() @IsOptional() @IsString() drivingLicenseNo?: string;
    @ApiPropertyOptional() @IsOptional() @IsDateString() drivingLicenseIssueDate?: string;
    @ApiPropertyOptional() @IsOptional() @IsDateString() drivingLicenseExpiryDate?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() licenseIssueCity?: string;
  }
  
  export class CreateExperienceDto {
    @ApiPropertyOptional() @IsBoolean() isExServiceMen: boolean;
    @ApiPropertyOptional() @IsOptional() @IsString() rankName: string;
    @ApiPropertyOptional() @IsOptional() @IsString() armyNumber: string;
    @ApiPropertyOptional() @IsOptional() @IsString() unit: string;
    @ApiPropertyOptional() @IsOptional() @IsString() exServiceDischargeNumber: string;
    @ApiPropertyOptional() @IsOptional() @IsString() branch: string;
    @ApiPropertyOptional() @IsOptional() @IsNumber() serviceYears: number;
    @ApiPropertyOptional() @IsOptional() @IsNumber() serviceMonths: number;
    @ApiPropertyOptional() @IsOptional() @IsNumber() securityYears: number;
    @ApiPropertyOptional() @IsOptional() @IsString() place: string;
    @ApiPropertyOptional() @IsOptional() @IsString() recentCivilEmployment: string;
  }
  
export class CreateReferenceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fatherName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnicNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currentAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() permanentAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnicFront?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnicBack?: string;
  @IsOptional() @IsString() guardId?: string;
}  export class CreateBankAccountDto {
    @ApiPropertyOptional() @IsOptional() @IsString() bankName: string;
    @ApiPropertyOptional() @IsOptional() @IsString() bankCode: string;
    @ApiPropertyOptional() @IsOptional() @IsString() accountTitle: string;
    @ApiPropertyOptional() @IsOptional() @IsString() accountNumber: string;
    @ApiPropertyOptional() @IsOptional() @IsString() IBAN: string;
    @ApiPropertyOptional() @IsOptional() @IsString() branchCode: string;
    @ApiPropertyOptional() @IsOptional() @IsString() branch: string;
  }


  export class CreateDocumentsDto {
    @IsOptional() @IsUUID() employeeId?: string;
    @IsOptional() @IsUUID() guardId?: string;
    @ApiPropertyOptional() @IsString() picture: string;
    @ApiPropertyOptional() @IsString() cnicFront: string;
    @ApiPropertyOptional() @IsString() cnicBack: string;
    @ApiPropertyOptional() @IsOptional() @IsString() licenseFront: string;
    @ApiPropertyOptional() @IsOptional() @IsString() licenseBack: string;
    @ApiPropertyOptional() @IsOptional() @IsString() policeVerification: string;
    @ApiPropertyOptional() @IsOptional() @IsString() specialBranchVerification: string;
    @ApiPropertyOptional() @IsOptional() @IsString() dischargeBook: string;
    @ApiPropertyOptional() @IsOptional() @IsString() NadraVeriSys: string;
    @ApiPropertyOptional() @IsOptional() @IsString() NadraVeriSysRef1: string;
    @ApiPropertyOptional() @IsOptional() @IsString() NadraVeriSysRef2: string;
    @ApiPropertyOptional() @IsOptional() @IsString() healthCertificate: string;
    @ApiPropertyOptional() @IsOptional() @IsString() medicalDocument: string;
    @ApiPropertyOptional() @IsOptional() @IsString() DDCDriving: string;
    @ApiPropertyOptional() @IsOptional() @IsString() educationCertificate: string;
    @ApiPropertyOptional() @IsOptional() @IsString() APSAATrainingCertificate: string;
    @ApiPropertyOptional() @IsOptional() @IsString() misc1: string;
    @ApiPropertyOptional() @IsOptional() @IsString() misc2: string;
    @ApiPropertyOptional()  @IsBoolean() originalCNICSubmitted: boolean;
  }

  
  export class CreateBiometricDto {
    @ApiPropertyOptional() @IsOptional() @IsString() rightThumb?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() rightMiddleFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() rightLittleFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() leftThumb?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() leftMiddleFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() leftLittleFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() rightForeFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() rightRingFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() rightFourFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() leftFourFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() leftRingFinger?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() leftForeFinger?: string;
  }
  
  export class CreateGuardDto {
    // @ApiProperty() @IsUUID() organizationId: string;
    @ApiProperty() @IsUUID() officeId: string;

    @ApiProperty() @IsDateString() registrationDate: string;
  
    @ApiPropertyOptional() @IsOptional() @IsInt() serviceNumber?: number;
    @ApiPropertyOptional() @IsDateString() dateOfBirth: string;
    @ApiPropertyOptional() @IsString() fullName: string;
    @ApiPropertyOptional() @IsOptional() @IsString() fatherName: string;
    @ApiPropertyOptional() @IsString() cnicNumber: string;
    @ApiPropertyOptional() @IsDateString() cnicIssueDate: string;
    @ApiPropertyOptional() @IsDateString() cnicExpiryDate: string;
    @ApiPropertyOptional() @IsString() contactNumber: string
  
    @ApiPropertyOptional() @IsOptional() @IsString() currentAddress: string;
    @ApiPropertyOptional() @IsOptional() @IsString() permanentAddress: string;
    @ApiPropertyOptional() @IsOptional() @IsString() currentAreaPoliceStation: string;
    @ApiPropertyOptional() @IsOptional() @IsString() currentAreaPoliceContact: string;
    @ApiPropertyOptional() @IsOptional() @IsString() permanentAreaPoliceStation: string;
    @ApiPropertyOptional() @IsOptional() @IsString() permanentAreaPoliceContact: string;
  
    @ApiPropertyOptional() @IsOptional() @IsString() religion: string;
    @ApiPropertyOptional() @IsOptional() @IsString() religionSect: string;
    @ApiPropertyOptional() @IsOptional() @IsNumber() weight: number;
    @ApiPropertyOptional() @IsOptional() @IsNumber() height: number;
    @ApiPropertyOptional() @IsOptional() @IsString() bloodGroup: string;
    @ApiPropertyOptional() @IsOptional() @IsString() bloodPressure: string;
    @ApiPropertyOptional() @IsOptional() @IsString() heartBeat: string;
    @ApiPropertyOptional() @IsOptional() @IsString() eyeColor: string;
  
    @ApiPropertyOptional() @IsOptional() @IsString() disability?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() eobiNumber?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() sessiNumber?: string;
  
    @ApiPropertyOptional() @IsOptional() @IsString() kinName: string;
    @ApiPropertyOptional() @IsOptional() @IsString() kinFatherName: string;
    @ApiPropertyOptional() @IsOptional() @IsString() kinRelation: string;
    @ApiPropertyOptional() @IsOptional() @IsString() kinCNIC: string;
    @ApiPropertyOptional() @IsOptional() @IsString() kinContactNumber: string;
  
    @ApiProperty({ type: () => CreateAcademicDto })
    @ValidateNested()
    @Type(() => CreateAcademicDto)
    academic: CreateAcademicDto;
  
    @ApiProperty({ type: () => CreateDrivingLicenseDto })
    @ValidateNested()
    @Type(() => CreateDrivingLicenseDto)
    drivingLicense: CreateDrivingLicenseDto;
  
    @ApiProperty({ type: [CreateExperienceDto] })
    @ValidateNested()
    @IsArray() @Type(() => CreateExperienceDto)
    guardExperience: CreateExperienceDto[];
  
    @ApiPropertyOptional({ type: [CreateReferenceDto], required: false })
    @IsOptional()
    @ValidateNested()
    @IsArray() 
    @Type(() => CreateReferenceDto)
    references?: CreateReferenceDto[];
  
    @ApiProperty({ type: () => CreateBankAccountDto })
    @ValidateNested()  
    @Type(() => CreateBankAccountDto)
    bankAccount: CreateBankAccountDto;

    @ApiProperty({ type: () => CreateDocumentsDto })
    @ValidateNested()
    @Type(() => CreateDocumentsDto )
    guardDocuments: CreateDocumentsDto;

    @ApiPropertyOptional({ type: () => CreateBiometricDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateBiometricDto)
    biometric?: CreateBiometricDto;
  }
  



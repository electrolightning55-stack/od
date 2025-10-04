import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsInt,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateRequestedGuardFinanceDto {
  
  // @ApiProperty()  
  // @IsUUID()
  // @IsNotEmpty()
  // requestedGuardId: string;

  // @ApiProperty()
  // @IsUUID()
  // @IsNotEmpty()
  // locationId: string;
  
  @ApiProperty()
  @IsNumber()
  salaryPerMonth: number;

  @ApiProperty()
  @IsNumber()
  gazettedHoliday: number;

  @ApiProperty()
  @IsNumber()
  overtimePerHour: number;

  @ApiProperty()
  @IsNumber()
  allowance: number;
}

class CreateRequestedGuardDto {

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  guardCategoryId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  shiftId: string;

  @ApiProperty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  gazettedHoliday: number;

  @ApiProperty()
  @IsNumber()
  chargesPerMonth: number;

  @ApiProperty()
  @IsNumber()
  overtimePerHour: number;

  @ApiProperty()
  @IsNumber()
  allowance: number;

  @ApiProperty({type : ()=> CreateRequestedGuardFinanceDto})
  @ValidateNested()
  @Type(() => CreateRequestedGuardFinanceDto)
  finances: CreateRequestedGuardFinanceDto;
}

export class CreateLocationTaxDto {
  // @ApiProperty()
  // @IsUUID()
  // locationId: string;

  @ApiProperty()
  @IsString()
  taxType: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  percentage: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsBoolean()
  addInvoice: boolean;
}

export class CreateLocationDto {

  @ApiProperty()  
  @IsUUID()
  clientId: string;

  @ApiProperty()  
  @IsUUID()
  officeId: string;

  @ApiProperty()  
  @IsString()
  locationName: string;

  @ApiProperty()
  @IsOptional()  
  @IsString()
  createdLocationId: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  provinceState: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  GPScoordinate: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  locationTypeId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  authorizedPersonName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  authorizedPersonNumber: string;

  @ApiProperty()
  @IsOptional() 
  @IsString()
  authorizedPersonDesignation: string;

  @ApiProperty({ type: () => [CreateLocationTaxDto] })
  @IsArray()
  @Type(() => CreateLocationTaxDto)
  taxes: CreateLocationTaxDto[];

  @ApiProperty({ type: () => [CreateRequestedGuardDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestedGuardDto)
  requestedGuards: CreateRequestedGuardDto[];

}

import { IsUUID, IsEnum, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DeductionType {
  sessiPessiFund = 'sessiPessiFund',
  eobiFund = 'eobiFund',
  insurance = 'insurance',
  advances = 'advances',
  loanRepayment = 'loanRepayment',
  penalty = 'penalty',
  miscCharges = 'miscCharges',
}

export class CreateGuardDeductionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  guardId: string;

  @ApiProperty({ enum: DeductionType, example: DeductionType.insurance })
  @IsNotEmpty()
  @IsEnum(DeductionType)
  deductionType: DeductionType;

  @ApiProperty({ example: 1500.0 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2025-08-01T00:00:00.000Z' })
  @IsDateString()
  date: string;
}

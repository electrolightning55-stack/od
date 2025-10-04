import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateGuardAllowanceDto {
  @ApiProperty({
  })
  @IsUUID()
  guardId: string;

  @ApiProperty({
  })
  @IsUUID()
  requestedGuardId: string;

   @ApiProperty({  })
  @IsUUID()
  locationPayrollDurationId: string;

  @ApiProperty({
  description: 'Allowance percentage as a fraction (e.g., 0.25 for 25%)',
  minimum: 0,
  maximum: 1,
  example: 0.25,
})
  @IsNumber()
  @Min(0)
  @Max(1)
  allowancePercentage: number;

  @ApiProperty({
  })
  @IsInt()
  @Min(0)
  holidayCount: number;

  @ApiProperty({
  })
  @IsInt()
  @Min(0)
  overTimeCount: number;


}

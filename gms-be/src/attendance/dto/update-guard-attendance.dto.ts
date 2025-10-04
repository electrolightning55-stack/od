import { PartialType } from '@nestjs/mapped-types';
import { CreateGuardAttendanceDto } from './create-guard-attendance.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { AttendanceEnum } from 'src/common/enums/attendance-enum';

export class UpdateGuardAttendanceDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;  

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  guardId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  shiftId: string;

  @ApiProperty({
    enum: AttendanceEnum,
    description: 'Attendance type: P = Present, A = Absent, R = Relief, L = Leave',
    example: AttendanceEnum.P,
  })
  @IsOptional()
  @IsEnum(AttendanceEnum)
  type: AttendanceEnum;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  date: string;
}


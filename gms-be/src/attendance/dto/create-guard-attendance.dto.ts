import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { AttendanceEnum } from 'src/common/enums/attendance-enum';

export class CreateGuardAttendanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  locationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  guardId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  shiftId: string;

  @ApiProperty({
    enum: AttendanceEnum,
    description: 'Attendance type: P = Present, A = Absent, R = Relief, L = Leave',
    example: AttendanceEnum.P,
  })
  @IsNotEmpty()
  @IsEnum(AttendanceEnum)
  type: AttendanceEnum;

  @ApiProperty()
  @IsDateString()
  date: string;
}

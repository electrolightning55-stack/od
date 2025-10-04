import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Name of the role' })
  @IsNotEmpty()
  @IsString()
  roleName: string;
}

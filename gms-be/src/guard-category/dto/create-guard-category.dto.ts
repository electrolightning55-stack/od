import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGuardCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryName: string;
}

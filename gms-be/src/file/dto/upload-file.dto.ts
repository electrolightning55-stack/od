import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FileUploadDto {

  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  fileType: string;
}

export class FileGetDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;
}

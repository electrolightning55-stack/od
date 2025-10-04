import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateOfficeDto {
  @IsString()
  @IsNotEmpty()
  branchName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

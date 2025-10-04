// dto/guard-upload.dto.ts
import {
  IsDateString,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  Length,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GuardUploadDto {

  @IsNotEmpty()
  @IsString()
  serviceNumber: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  fatherName: string;

  @IsDateString()
  dateOfBirth: string;

  @Matches(/^\d{5}-\d{7}-\d{1}$/, {
    message: 'Invalid CNIC number format',
  })
  cnicNumber: string;

  @IsDateString()
  cnicIssueDate: string;

  @IsDateString()
  cnicExpiryDate: string;

//   @IsPhoneNumber('PK', { message: 'Invalid Pakistani phone number' })
  @IsString()
  contactNumber: string;

  @IsString()
  currentAddress: string;

  @IsString()
  height: string;

  @IsOptional()
  @IsString()
  referenceName: string;
  
  @IsOptional()
  @IsString()
  referenceFatherName: string;

  @IsOptional()
  // @Matches(/^\d{5}-\d{7}-\d{1}$/, {
  //   message: 'Invalid Reference CNIC number format',
  // })
  referenceCnicNumber: string;
}

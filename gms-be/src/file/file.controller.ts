import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ValidationPipe, InternalServerErrorException } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role-guard';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { FileGetDto, FileUploadDto } from './dto/upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/common/utils/file-size-validation-pipe';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('presigned-url')
  @ApiOperation({ summary: "get S3 bucket presigned url" })
  async getPresignedUrl(@Body() body: FileUploadDto) {
    try {
      // Return raw result here. A global TransformInterceptor will wrap this
      // response into the standard { status, message, data } shape. Returning
      // the wrapped object here caused a double-wrap and nested data.
      const result = await this.fileService.getPresignedUrl(body);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to generate upload URL'
      );
    }
  }

  @Post('download-url')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary :"get S3 bucket download url" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  async getDownloadUrl(@Body() body: FileGetDto) {
    const url = await this.fileService.getSecureDownloadUrl(body.key);
    return { url };
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.parseCSV(file.buffer);
  }


  @Post('upload/guards')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.organizationAdmin)
  // @ResponseMessage('Guard uploaded successfully')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGuards(
    @GetOrganizationId() organizationId: string,
    @Body(new ValidationPipe({ whitelist: true })) officeId,
    @UploadedFile( new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 10485760 }),
      // new FileTypeValidator({ fileType: "/csv" })
    ],
  }),) file: Express.Multer.File) {
    return this.fileService.uploadGuards(organizationId, officeId ,file.buffer);
  }

}

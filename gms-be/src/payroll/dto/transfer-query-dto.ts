import { IsEnum } from 'class-validator';
import { TransferType } from 'src/common/enums/transfer-enum';

export class TransferQueryDto {
  @IsEnum(TransferType, { message: 'transferType must be either IFT or IBFT' })
  transferType: TransferType;
}

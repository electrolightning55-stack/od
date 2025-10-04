import { PartialType } from '@nestjs/swagger';
import { CreateGuardDeductionDto } from './create-guard-deductions.dto';

export class UpdateGuardDeductionDto extends PartialType(CreateGuardDeductionDto) {}

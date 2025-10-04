import { PartialType } from '@nestjs/swagger';
import { CreateGuardCategoryDto } from './create-guard-category.dto';

export class UpdateGuardCategoryDto extends PartialType(CreateGuardCategoryDto) {}

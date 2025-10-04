import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationPayRollDto } from './create-location-payroll-duration.dto';

export class UpdateLocationPayRollDto extends PartialType(CreateLocationPayRollDto) {}

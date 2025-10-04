import { Module } from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { LocationTypeController } from './location-type.controller';

@Module({
  providers: [LocationTypeService],
  controllers: [LocationTypeController]
})
export class LocationTypeModule {}

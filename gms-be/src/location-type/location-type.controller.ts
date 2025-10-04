import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';

@ApiTags("Location Type")
@Controller('location-type')
export class LocationTypeController {
  constructor(private readonly locationService: LocationTypeService) {}

  @Post()
  create(@Body() data: CreateLocationTypeDto) {
    return this.locationService.create(data);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: CreateLocationTypeDto) {
    return this.locationService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}

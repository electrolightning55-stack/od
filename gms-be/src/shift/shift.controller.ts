import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
  } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
  
  @ApiTags('Shift')
  @Controller('shifts')
  export class ShiftController {
    constructor(private readonly shiftService: ShiftService) {}
  
    @Post()
    @ApiResponse({ status: 201, description: 'Role created successfully' })
    create(@Body() createShiftDto: CreateShiftDto) {
      return this.shiftService.create(createShiftDto);
    }
  
    @Get()
    findAll() {
      return this.shiftService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string)  {
      return this.shiftService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateShiftDto: UpdateShiftDto) {
      return this.shiftService.update(id, updateShiftDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.shiftService.remove(id);
    }
}
  
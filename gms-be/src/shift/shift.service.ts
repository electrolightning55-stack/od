import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftService {
  private readonly logger = new Logger(ShiftService.name);

  constructor(private prisma: PrismaService) {}

  create(dto: CreateShiftDto) {
    this.logger.debug(`create shift called name=${dto.shiftName}`);
    return this.prisma.shift.create({ data: dto });
  }

  findAll() {
    this.logger.debug('findAll shifts called');
    return this.prisma.shift.findMany();
  }

  async findOne(id: string) {
    this.logger.debug(`findOne shift called id=${id}`);
    const category = await this.prisma.shift.findUnique({ where: { id } });
    if (!category) {
      this.logger.warn(`Shift not found id=${id}`);
      throw new NotFoundException(`Shift with ${id} not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdateShiftDto) {
    await this.findOne(id); 
    return this.prisma.shift.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id); 
    return this.prisma.shift.delete({ where: { id } });
  }
}

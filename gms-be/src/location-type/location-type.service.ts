import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, locationType } from '@prisma/client';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { UpdateLocationTypeDto } from './dto/update-location-type.dto';

@Injectable()
export class LocationTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLocationTypeDto) {
    try {
         const locationType = await this.prisma.locationType.findFirst({ where : { type : dto.type }});

         if(locationType) throw new ConflictException("this type already exists");

        return this.prisma.locationType.create({ data : { ...dto }  });
    } catch (error) {
        handlePrismaError(error);
    }
  }

  async findAll() {
    return this.prisma.locationType.findMany();
  }

  async findOne(id: string){
    return this.prisma.locationType.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateLocationTypeDto ) {
    try {
        const locationType = await this.prisma.locationType.findUnique({ where : {id}});

        if(!locationType) throw new NotFoundException("this type doesn't exist");

        return this.prisma.locationType.update({ where: { id }, data });
    } catch (error) {
        handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
        const locationType = await this.prisma.locationType.findUnique({ where : {id}});

        if(!locationType) throw new NotFoundException("this type doesn't exist");

        return this.prisma.locationType.delete({ where: { id } });
    } catch (error) {
        handlePrismaError
    }
  }
}

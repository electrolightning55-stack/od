import { ConflictException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuardCategoryDto } from './dto/create-guard-category.dto';
import { UpdateGuardCategoryDto } from './dto/update-guard-category.dto';
import { GetOrganizationId } from 'src/common/decorators/get-organization-Id.decorator';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';

@Injectable()
export class GuardCategoryService {
  private readonly logger = new Logger(GuardCategoryService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGuardCategoryDto, organizationId: string) {
    this.logger.debug(`create called for organizationId=${organizationId} categoryName=${dto.categoryName}`);
    try {
      const guardCategory = await this.prisma.guardCategory.findFirst({
        where : { 
          organizationId : organizationId,
          categoryName : dto.categoryName 
        }});

      if(guardCategory){
        this.logger.warn(`attempt to create duplicate guard category for org=${organizationId} name=${dto.categoryName}`);
        throw new ConflictException("this category already exist");
      }
      const created = await this.prisma.guardCategory.create({ data: {...dto, organizationId} });
      this.logger.debug(`guard category created id=${created.id} org=${organizationId}`);
      return created;
    } catch (error) {
      this.logger.error('Error in create guard category', error as any);
      handlePrismaError(error)
    }
  }

  findAll() {
    this.logger.debug('findAll called');
    return this.prisma.guardCategory.findMany();
  }

  findAllByOrganizationId(organizationId : string) {
    this.logger.debug(`findAllByOrganizationId called for org=${organizationId}`);
    return this.prisma.guardCategory.findMany({ where : {organizationId : organizationId}});
  }

  async findOne(id: string, organizationId : string) {
    this.logger.debug(`findOne called id=${id} org=${organizationId}`);
    const category = await this.prisma.guardCategory.findUnique({ where: { id : id , organizationId : organizationId } });
    if (!category) {
      this.logger.warn(`GuardCategory not found id=${id} org=${organizationId}`);
      throw new NotFoundException(`GuardCategory ${id} not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdateGuardCategoryDto, organizationId : string) {
    this.logger.debug(`update called id=${id} org=${organizationId}`);
    try {
      const guardCategory = await this.prisma.guardCategory.findFirst({
        where : { 
          organizationId : organizationId,
          id : id 
        }});

      if(!guardCategory){
        this.logger.warn(`update failed - category not found id=${id} org=${organizationId}`);
        throw new NotFoundException("this category doesn't exist for this organization");
      }

      const updated = await this.prisma.guardCategory.update({ where: { id }, data: dto });
      this.logger.debug(`guard category updated id=${id} org=${organizationId}`);
      return updated;
    } catch (error) {
      this.logger.error('Error in update guard category', error as any);
      handlePrismaError(error);
    }
  }

  async remove(id: string, organizationId : string ) {
    this.logger.debug(`remove called id=${id} org=${organizationId}`);
    try {
      const guardCategory = await this.prisma.guardCategory.findFirst({
        where : { 
          organizationId : organizationId,
          id : id 
        }});

      if(!guardCategory){
        this.logger.warn(`remove failed - category not found id=${id} org=${organizationId}`);
        throw new NotFoundException("this category doesn't exist for this organization");
      }  
      
      const removed = await this.prisma.guardCategory.delete({ where: { id: id, organizationId : organizationId } });
      this.logger.debug(`guard category removed id=${id} org=${organizationId}`);
      return removed;
    } catch (error) {
      this.logger.error('Error in remove guard category', error as any);
      handlePrismaError(error);
    }
  }
}

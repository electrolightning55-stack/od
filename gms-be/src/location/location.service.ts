import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { generateRandomNumber } from 'src/common/utils/random-num-generator';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLocationDto, organizationId : string) {
    try {

      const generatedId : number = generateRandomNumber(5);

      const location = await this.prisma.location.findFirst({ where  : { organizationId : organizationId , locationName : dto.locationName }});
      if(location) throw new ConflictException("Given location name already exists");
      
      return await this.prisma.location.create({
        data: {
          organizationId: organizationId,
          clientId: dto.clientId,
          locationName: dto.locationName,
          createdLocationId: generatedId.toString(),
          address: dto.address,
          city: dto.city,
          provinceState: dto.provinceState,
          country: dto.country,
          GPScoordinate: dto.GPScoordinate,
          locationTypeId: dto.locationTypeId,
          authorizedPersonName: dto.authorizedPersonName,
          authorizedPersonNumber: dto.authorizedPersonNumber,
          authorizedPersonDesignation: dto.authorizedPersonDesignation,
          taxes : { create : dto.taxes.map((tax) => ({
            addInvoice : tax.addInvoice,
            amount : tax.amount,
            percentage :tax.percentage,
            taxType : tax.taxType
          })) },
          requestedGuards: {
                create: dto.requestedGuards.map((guard) => ({
                  guardCategoryId: guard.guardCategoryId,
                  shiftId: guard.shiftId,
                  quantity: guard.quantity,
                  gazettedHoliday : guard.gazettedHoliday,
                  chargesPerMonth: guard.chargesPerMonth,
                  overtimePerHour: guard.overtimePerHour,
                  allowance: guard.allowance,
                  finances: {
                        create: {
                          gazettedHoliday : guard.finances.gazettedHoliday,
                          salaryPerMonth: guard.finances.salaryPerMonth,
                          overtimePerHour: guard.finances.overtimePerHour,
                          allowance: guard.finances.allowance,
                        },
                      }
                })),
              }
        },
        include: {
          requestedGuards: {
            include: {
              finances: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAll() {
    return this.prisma.location.findMany({
      include: {
        requestedGuards: {
          include: {
            finances: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        requestedGuards: {
          include: {
            finances: true,
          },
        },
      },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async findByOrganizationId(organizationId: string) {
    const location = await this.prisma.location.findMany({
      where: { 
        organizationId : organizationId,
        assignedGuard : {
          every : {
            deploymentTill : null
          }
        } 
      },
      include: {
        assignedGuard : {
          select : {
            deploymentDate : true,
            deploymentTill : true,
            guardCategory : {
              select : {
                categoryName : true
              }
            },
            guard : {
              select : {
                fullName : true,
                serviceNumber : true
              }
            }

          }
        },
        client : {
          select : {
            id : true,
            contractNumber : true,
            companyName : true,
            contactNumber : true,
            industry : true,
            address : true,
            city : true,
            state : true,
          }
        },
        requestedGuards: {
          include: {
            guardCategory : {
              select : { categoryName : true}
            },
            finances: true,
          },
        },
      },
    });

    return location;
  }

  async findByClientId(clientId : string , organizationId : string) {
    const location = await this.prisma.location.findMany({
      where: {
        clientId : clientId, 
        organizationId : organizationId 
      },
      include: {
        assignedGuard : true,
        requestedGuards: {
          include: {
            finances: true,
          },
        },
      },
    });

    return location;
  }

  async findAssignedGuardByLocation(locationId : string , organizationId : string) {
    const locations = await this.prisma.location.findMany({
      where: {
        id : locationId,
        organizationId : organizationId,
        assignedGuard : {
          every : {
            deploymentTill : null
          }
        }
      },
      select: {        
        assignedGuard : {
          select  : {
            requestedGuard : {
              select : {
                Shift : true,
              }
            },
            deploymentDate : true,
            deploymentTill : true,
            guardCategory : {
              select : {
                categoryName : true
              }
            },
            guard : true
          }
        },
      },
    });

      const assignedGuards = locations[0]?.assignedGuard ?? [];

      const enriched = assignedGuards.map((ag) => {
      const deploymentDate = new Date(ag.deploymentDate);
      const deploymentTill = ag.deploymentTill ? new Date(ag.deploymentTill) : new Date();

      const timeDiff = deploymentTill.getTime() - deploymentDate.getTime();
      const totalWorkingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      return {
        ...ag,
        totalWorkingDays,
      };
    });

    return enriched;
  }

    async update(id: string, dto: Partial<CreateLocationDto>, organizationId: string) {
    try {
      const updateData: any = {
        ...(dto.clientId && { clientId: dto.clientId }),
        ...(dto.locationName && { locationName: dto.locationName }),
        ...(dto.createdLocationId && { createdLocationId: dto.createdLocationId }),
        ...(dto.address && { address: dto.address }),
        ...(dto.city && { city: dto.city }),
        ...(dto.provinceState && { provinceState: dto.provinceState }),
        ...(dto.country && { country: dto.country }),
        ...(dto.GPScoordinate && { GPScoordinate: dto.GPScoordinate }),
        ...(dto.locationTypeId && { locationTypeId: dto.locationTypeId }),
        ...(dto.authorizedPersonName && { authorizedPersonName: dto.authorizedPersonName }),
        ...(dto.authorizedPersonNumber && { authorizedPersonNumber: dto.authorizedPersonNumber }),
        ...(dto.authorizedPersonDesignation && { authorizedPersonDesignation: dto.authorizedPersonDesignation }),
      };

      if (dto.taxes) {
        updateData.taxes = {
          deleteMany: {}, 
          create: dto.taxes.map((tax) => ({
            addInvoice: tax.addInvoice,
            amount: tax.amount,
            percentage: tax.percentage,
            taxType: tax.taxType,
          })),
        };
      }

      if (dto.requestedGuards) {
        updateData.requestedGuards = {
          deleteMany: {}, 
          create: dto.requestedGuards.map((guard) => ({
            guardCategoryId: guard.guardCategoryId,
            shiftId: guard.shiftId,
            quantity: guard.quantity,
            gazettedHoliday: guard.gazettedHoliday,
            chargesPerMonth: guard.chargesPerMonth,
            overtimePerHour: guard.overtimePerHour,
            allowance: guard.allowance,
            finances: {
              create: {
                gazettedHoliday : guard.finances.gazettedHoliday,
                salaryPerMonth: guard.finances.salaryPerMonth,
                overtimePerHour: guard.finances.overtimePerHour,
                allowance: guard.finances.allowance,
              },
            },
          })),
        };
      }

      return await this.prisma.location.update({
        where: {
          id,
          organizationId,
        },
        data: updateData,
        include: {
          requestedGuards: {
            include: {
              finances: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }


  async remove(id: string) {
    try {

      // First delete RequestedGuardFinance → RequestedGuard → Location

      const requestedGuards = await this.prisma.requestedGuard.findMany({
        where: { locationId: id },
        select: { id: true },
      });

      const guardIds = requestedGuards.map((g) => g.id);

      await this.prisma.requestedGuardFinance.deleteMany({
        where: { requestedGuardId: { in: guardIds } },
      });

      await this.prisma.requestedGuard.deleteMany({
        where: { locationId: id },
      });

      await this.prisma.location.delete({
        where: { id },
      });  

      return await this.prisma.location.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getRequestedGuardsByLocationId(locationId: string) {
  try {
    return await this.prisma.requestedGuard.findMany({ 
      where: { locationId: locationId, },
      include: {
        guardCategory: {
          select: {
            id: true,
            categoryName: true
          }
        }
      }
    });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

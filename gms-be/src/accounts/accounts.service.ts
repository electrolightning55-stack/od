import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuardDeductionDto } from './dto/create-guard-deductions.dto';
import { UpdateGuardDto } from 'src/guard/dto/update-guard-dto';
import { UpdateGuardDeductionDto } from './dto/update-guard-deductions.dto';
import { endOfMonth, startOfMonth } from 'date-fns';

@Injectable()
export class AccountsService {

    constructor(private readonly prisma : PrismaService){}

    //#region Guards Deductions
    async createGuardDeductions(dto : CreateGuardDeductionDto){
        try {
            const guard = await this.prisma.guard.findUnique({ where : { id  : dto.guardId}});
            if(!guard) throw new NotFoundException("Guard doesn't exist");

            const date = new Date(dto.date);

            const monthStart = startOfMonth(date);
            const monthEnd = endOfMonth(date);      

            const currentlyAssignedLocation = await this.prisma.guard.findFirst({
                where : {
                    id : dto.guardId,
                },
                select : {
                    assignedGuard : {
                        where: {
                            OR: [
                            {
                                deploymentTill: null, 
                            },
                            {
                                deploymentTill: {
                                gte: monthStart,
                                lte: monthEnd, 
                                },
                            },
                            ],
                        },
                    }
                }
            });
            if(!currentlyAssignedLocation) throw new NotFoundException("This guard is not currently assigned to any location");


            return await this.prisma.guardDeductions.create({ data : {
                ...dto, 
                locationId : currentlyAssignedLocation.assignedGuard[0].locationId
            }});

        } catch (error) {
            handlePrismaError(error)
        }
    }

    async getAllGuardDeductions(){
        try {
            return await this.prisma.guardDeductions.findMany();
        } catch (error) {
            handlePrismaError(error)
        }
    }

    async updateGuardDeduction(id : string , dto : UpdateGuardDeductionDto){
        try {
            return await this.prisma.guardDeductions.update({
                where : { id },
                data : dto,
            });
        } catch (error) {
            handlePrismaError(error)
        }
    }

    async deleteGuardDeductions( id : string){
        try {
            return await this.prisma.guardDeductions.delete({ where : { id }});
        } catch (error) {
            handlePrismaError(error)
        }
    }


    //#endregion
}

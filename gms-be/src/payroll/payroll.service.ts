import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { addDays, addMonths, differenceInCalendarDays, endOfDay, getMonth, getYear, max, min, startOfDay, startOfMonth } from 'date-fns';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuardAllowanceDto } from './dto/create-guard-allowance.dto';
import { CreateLocationPayRollDto } from './dto/create-location-payroll-duration.dto';
import { UpdateLocationPayRollDto } from './dto/update-location-payroll.dto';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { TransferType } from 'src/common/enums/transfer-enum';
import { TransferQueryDto } from './dto/transfer-query-dto';

@Injectable()
export class PayrollService {
    constructor(private readonly prisma : PrismaService){}

    async getAttendanceLockStatus(startDate : Date, locationId : string) {
        try {
            const payrollDuration = await this.prisma.locationPayRollDuration.findFirst({
                where: { startDate : startDate, locationId : locationId },
            });

            if(!payrollDuration){
                return { isLocked : false };
            }

            return payrollDuration;
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async getAllAttendanceLocks() {
        try {
            const payrollDuration = await this.prisma.locationPayRollDuration.findMany({
            });

            return payrollDuration;
        } catch (error) {
            handlePrismaError(error);
        }
    }


    async lockAttendance(dto: CreateLocationPayRollDto, organizationId : string) {
        try {
            const totalDays = differenceInCalendarDays(dto.endDate, dto.startDate);
            const nextUnlockTime = addDays(dto.endDate, 1);


            const existingPayRollDuration = await this.prisma.locationPayRollDuration.findFirst({
                where : {
                    locationId : dto.locationId,
                        startDate: {
                            lte: dto.endDate, 
                        },
                        endDate: {
                            gte: dto.startDate,  
                        },
                    }
                }
            );

            if (existingPayRollDuration) {
                throw new BadRequestException("Payroll for this month already exists for this location.");
            }

            // guards attendance constraint
            // const guards = await this.prisma.guard.findMany({
            //     where : {
            //         // officeId: officeId || null,
            //         organizationId : organizationId,
            //         assignedGuard: {
            //             some: {
            //                 locationId : dto.locationId,
            //             },
            //         },
            //     },
            //     select: {
            //         id: true,
            //         fullName: true,
            //         serviceNumber: true,
            //         assignedGuard: {
            //         where : {
            //             locationId : dto.locationId,
            //         },
            //         select: {
            //             id: true,
            //             deploymentDate: true,
            //             deploymentTill: true,
                        
            //         },
            //         },
            //         guardsAttendance: {
            //         where: {
            //             date: {
            //                 gte: dto.startDate,
            //                 lt: dto.endDate,
            //             },
            //             },
            //         },
            //     },
            // });

            // const today = new Date();

            // const completeAttendanceGuards = guards.map(guard => {
            // const assigned = guard.assignedGuard[0]; 

            // const deploymentStart = new Date(assigned.deploymentDate);
            // const deploymentEnd = assigned.deploymentTill ? new Date(assigned.deploymentTill) : today;

            // const effectiveDeploymentStart = max([deploymentStart, dto.startDate]);
            // const effectiveDeploymentEnd = min([deploymentEnd, dto.endDate]);

            // const expectedAttendanceDays = differenceInCalendarDays(
            //     effectiveDeploymentEnd,
            //     effectiveDeploymentStart
            // ) + 1;

            // const actualAttendanceDays = guard.guardsAttendance.length;

            // const attendanceComplete = expectedAttendanceDays === actualAttendanceDays;

            // return {
            //     id: guard.id,
            //     fullName : guard.fullName,
            //     serviceNumber : guard.serviceNumber,
            //     expectedAttendanceDays,
            //     actualAttendanceDays,
            //     attendanceComplete,
            // };

            // });
            // const incompleteGuards = completeAttendanceGuards.filter(g => !g.attendanceComplete);
            // if (incompleteGuards.length > 0) {
            //     throw new ForbiddenException({
            //         message: `${incompleteGuards.length} guard(s) have incomplete attendance.`,
            //         guards: incompleteGuards[0],
            //     });
            // }

            const payrollDuration = await this.prisma.locationPayRollDuration.create({
                data: {
                    ...dto,
                    totalDays,
                    nextUnlockTime,
                },
            });

            
            return payrollDuration;
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async updateAttendanceLock(id : string,dto: UpdateLocationPayRollDto) {
        try {
            const payrollDuration = await this.prisma.locationPayRollDuration.update({
                where: {
                    id : id,
                },
                data : dto,
            });

            return payrollDuration;
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async deleteAttendanceLock(id: string) {
        try {
            const payrollDuration = await this.prisma.locationPayRollDuration.delete({
                where: {
                    id : id
                },                
            });

            return payrollDuration;
        } catch (error) {
            handlePrismaError(error);
        }
    }


    async findGuardAllowanceForPayRoll(locationId : string, organizationId : string,from : Date, to : Date, officeId? : string, serviceNumber? : number ){
        try {
            const location = await this.prisma.location.findUnique({ where : { id  : locationId, organizationId : organizationId }});
            if(!location) throw new NotFoundException("Location Not Found");

            // const start = startOfMonth(date);              
            // const end = addMonths(start, 1);  
            
            const fromDate = new Date(from);
            const toDate = new Date(to);
                 
            // for guard allowance duration
            const fromStart = startOfDay(fromDate);
            const fromEnd = endOfDay(fromDate);

            const toStart = startOfDay(toDate);
            const toEnd = endOfDay(toDate);

            const totalDays = differenceInCalendarDays(toDate, fromDate);


                const guardWhereCondition: any = {
                officeId: officeId || null,
                organizationId,
                assignedGuard: {
                    some: {
                        locationId,
                    },
                },
                };

                if (serviceNumber) {
                    const guard = await this.prisma.guard.findFirst({ where : {
                        officeId: officeId || null,
                        organizationId,
                        assignedGuard: {
                            some: {
                                locationId,
                            },
                        },
                        serviceNumber : serviceNumber
                    } });

                    if(!guard) throw new NotFoundException("No guard exists with given serviceNumber")
                    guardWhereCondition.serviceNumber = serviceNumber;
                }

                const guards = await this.prisma.guard.findMany({
                where: guardWhereCondition,
                select: {
                    id: true,
                    fullName: true,
                    serviceNumber: true,
                    fatherName: true,
                    assignedGuard: {
                    select: {
                        id: true,
                        deploymentDate: true,
                        deploymentTill: true,
                        location: { 
                        select: {
                            id: true,
                            locationName: true,
                            createdLocationId: true,
                            client: {
                            select: {
                                id: true,
                                companyName: true,
                                contractNumber: true,
                            },
                            },
                        },
                        },
                        requestedGuard: {
                        select: {
                            id : true,
                            finances: true,
                            Shift: {
                                select: { shiftName: true },
                            },
                            guardCategory: {
                                select: { categoryName: true },
                            },
                            guardAllowances : {
                                where : {
                                     duration: {
                                        startDate: {
                                            gte: fromStart,
                                            lte: fromEnd,
                                        },
                                        endDate: {
                                            gte: toStart,
                                            lte: toEnd,
                                        },
                                        },
                                     },
                                select : {
                                    allowancePercentage : true,
                                    holidayCount : true,
                                    overTimeCount : true,
                                    isActive : true,
                                }
                            }
                         },
                        },
                    },
                    },
                    guardsAttendance: {
                    where: {
                        date: {
                            gte: fromDate,
                            lt: toDate,
                        },
                        },
                    },
                },
                });                    
            

                const result = guards.map(guard => {
                let P = 0, A = 0, R = 0, L = 0;

                for (const att of guard.guardsAttendance) {
                    if (att.type === 'P') P++;
                    else if (att.type === 'R') R++;
                    else if (att.type === 'A') A++;
                    else if (att.type === 'L') L++;
                }

                const totalRecorded = P + R + L + A;
                // const missing = totalDays - totalRecorded;
                //   A += missing; 

                const salaryPerDay = guard.assignedGuard[0].requestedGuard.finances!.salaryPerMonth / totalDays;

                return {
                    id: guard.id,
                    fullName: guard.fullName,
                    serviceNumber: guard.serviceNumber,
                    fatherName: guard.fatherName,
                    requestedGuardId : guard.assignedGuard[0].requestedGuard.id,
                    assignedGuardId: guard.assignedGuard[0].id,
                    location : guard.assignedGuard[0].location,
                    guardCategory : guard.assignedGuard[0].requestedGuard.guardCategory.categoryName,
                    shift : guard.assignedGuard[0].requestedGuard.Shift.shiftName,
                    netSalary : salaryPerDay * P,
                    attendanceStats: {
                        P,
                        R,
                        L,
                        A
                    },
                    allowances : guard.assignedGuard[0].requestedGuard.guardAllowances.length == 0 ? { allowancePercentage : 0,holidayCount : 0 , overTimeCount : 0, isActive : false }  : guard.assignedGuard[0].requestedGuard.guardAllowances[0] ,
                    };
                });

                return {
                     dateRange : { 
                        from : fromDate,
                        to : toDate,
                        totalDays, 
                    },
                    result
                };

        } catch (error) {
            handlePrismaError(error);
        }
    }


    async createGuardAllowance(dtoList : CreateGuardAllowanceDto[] , organizationId : string){
        try {

            dtoList.forEach( async dto =>  {
                const guard = await this.prisma.guard.findUnique({ where : { id  : dto.guardId, organizationId : organizationId }});
                if(!guard) throw new NotFoundException("Guard Not Found");

                // const requestedGuard = await this.prisma.requestedGuard.findUnique({ where : { id  : dto.requestedGuardId, assignedGuard : {
                //     // guardId : dto.guardId
                //     // every
                // } }});
                // if(!requestedGuard) throw new NotFoundException("Incorrect Assigned guard Not Found");
            });

            const createdAllowances = await this.prisma.guardAllowances.createManyAndReturn({
                data : dtoList,
                skipDuplicates : true 
            })


            return createdAllowances;
            
        } catch (error) {
            handlePrismaError(error);
        }
    }


    async getAllGuardAllowance(){
        try {
           return await this.prisma.guardAllowances.findMany(); 
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async deleteGuardAllowance(id : string){
        try {
           return await this.prisma.guardAllowances.delete({ where : { id  : id }}); 
        } catch (error) {
            handlePrismaError(error);
        }
    }


    async generateLocationGrossPayRoll(locationId : string, organizationId : string,from : Date, to : Date, officeId? : string, serviceNumber? : number ){
        try {
            const location = await this.prisma.location.findUnique({ where : { id  : locationId, organizationId : organizationId }});
            if(!location) throw new NotFoundException("Location Not Found");

            // const start = startOfMonth(date);              
            // const end = addMonths(start, 1);  
            
            const fromDate = new Date(from);
            const toDate = new Date(to);
            const totalDays = differenceInCalendarDays(toDate, fromDate);

                const guardWhereCondition: any = {
                officeId: officeId || null,
                organizationId,
                assignedGuard: {
                    some: {
                        locationId,
                    },
                },
                };

                if (serviceNumber) {
                    const guard = await this.prisma.guard.findFirst({ where : {
                        officeId: officeId || null,
                        organizationId,
                        assignedGuard: {
                            some: {
                                locationId,
                            },
                        },
                        serviceNumber : serviceNumber
                    } });

                    if(!guard) throw new NotFoundException("No guard exists with given serviceNumber")
                    guardWhereCondition.serviceNumber = serviceNumber;
                }

                const guards = await this.prisma.guard.findMany({
                where: guardWhereCondition,
                select: {
                    id: true,
                    fullName: true,
                    serviceNumber: true,
                    fatherName: true,
                    assignedGuard: {
                    select: {
                        id: true,
                        deploymentDate: true,
                        deploymentTill: true,
                        location: { 
                        select: {
                            id: true,
                            locationName: true,
                            createdLocationId: true,
                            client: {
                            select: {
                                id: true,
                                companyName: true,
                                contractNumber: true,
                            },
                            },
                        },
                        },
                        requestedGuard: {
                        select: {
                            finances: true,
                            Shift: {
                                select: { shiftName: true },
                            },
                            guardCategory: {
                                select: { categoryName: true },
                            },
                            guardAllowances : {
                                select : {
                                    overTimeCount : true,
                                    allowancePercentage : true,
                                    holidayCount : true,
                                    }
                                }
                            },
                        },
                    },
                    },
                    guardsAttendance: {
                    where: {
                        date: {
                            gte: fromDate,
                            lt: toDate,
                        },
                    },
                    },
                },
                });                    
            

                const result = guards.map(guard => {
                let P = 0, A = 0, R = 0, L = 0;

                for (const att of guard.guardsAttendance) {
                    if (att.type === 'P') P++;
                    else if (att.type === 'R') R++;
                    else if (att.type === 'A') A++;
                    else if (att.type === 'L') L++;
                }

                const totalRecorded = P + R + L + A;
                // const missing = totalDays - totalRecorded;
                //   A += missing; 

                const salaryPerDay = guard.assignedGuard[0].requestedGuard.finances!.salaryPerMonth / totalDays;
                const netSalary = salaryPerDay * P;
                const allowance = guard.assignedGuard[0].requestedGuard.guardAllowances.length != 0 ? guard.assignedGuard[0].requestedGuard.guardAllowances[0] : { overTime : 0, gazettedHoliday : 0, allowance : 0, };                    
                const providedAllowances = guard.assignedGuard[0].requestedGuard.guardAllowances.length != 0 ? {
                        overTimeAmount : guard.assignedGuard[0].requestedGuard.finances!.overtimePerHour * guard.assignedGuard[0].requestedGuard.guardAllowances[0].overTimeCount,
                        gazettedHolidayAmount : guard.assignedGuard[0].requestedGuard.finances!.gazettedHoliday! * guard.assignedGuard[0].requestedGuard.guardAllowances[0].holidayCount,
                        allowanceAmount : guard.assignedGuard[0].requestedGuard.finances!.allowance  * guard.assignedGuard[0].requestedGuard.guardAllowances[0].allowancePercentage,
                    } : {
                        overTimeAmount : 0,
                        gazettedHolidayAmount : 0,
                        allowanceAmount : 0,
                    };                   


                return {
                    id: guard.id,
                    fullName: guard.fullName,
                    serviceNumber: guard.serviceNumber,
                    fatherName: guard.fatherName,
                    assignedGuardId: guard.assignedGuard[0].id,
                    location : guard.assignedGuard[0].location,
                    guardCategory : guard.assignedGuard[0].requestedGuard.guardCategory.categoryName,
                    shift : guard.assignedGuard[0].requestedGuard.Shift.shiftName,
                    netSalary : netSalary,
                    attendanceStats: {
                        P,
                        R,
                        L,
                        A
                    },
                    guardFinances : guard.assignedGuard[0].requestedGuard.finances,
                    allowance : allowance,
                    providedAllowances : providedAllowances,
                    totalGrossSalary : netSalary + providedAllowances.allowanceAmount + providedAllowances.gazettedHolidayAmount + providedAllowances.overTimeAmount,          
                  };
                });

                return result;
                // return guards;

        } catch (error) {
            handlePrismaError(error);
        }
    }


    async getGuardsDeductions(locationId : string, organizationId : string,from : Date, to : Date, officeId? : string, serviceNumber? : number ){
        try {
           const location = await this.prisma.location.findUnique({ where : { id  : locationId, organizationId : organizationId }});
            if(!location) throw new NotFoundException("Location Not Found");

            // const start = startOfMonth(date);              
            // const end = addMonths(start, 1);  
            
            const fromDate = new Date(from);
            const toDate = new Date(to);
            const totalDays = differenceInCalendarDays(toDate, fromDate);

                const guardWhereCondition: any = {
                officeId: officeId || null,
                organizationId,
                assignedGuard: {
                    some: {
                        locationId,
                    },
                },
                };

                if (serviceNumber) {
                    const guard = await this.prisma.guard.findFirst({ where : {
                        officeId: officeId || null,
                        organizationId,
                        assignedGuard: {
                            some: {
                                locationId,
                            },
                        },
                        serviceNumber : serviceNumber
                    } });

                    if(!guard) throw new NotFoundException("No guard exists with given serviceNumber")
                    guardWhereCondition.serviceNumber = serviceNumber;
                }

                const guards = await this.prisma.guard.findMany({
                where: guardWhereCondition,
                select: {
                    id: true,
                    fullName: true,
                    serviceNumber: true,
                    fatherName: true,
                    assignedGuard: {
                    select: {
                        id: true,
                        deploymentDate: true,
                        deploymentTill: true,
                    },
                    },
                    guardDeductions : {
                        where : {
                            locationId : locationId,
                        }
                    },
                    guardsAttendance: {
                    where: {
                        date: {
                            gte: fromDate,
                            lt: toDate,
                        },
                    },
                    },
                },
                });                    
            

                const result = guards.map(guard => {
                let P = 0, A = 0, R = 0, L = 0;

                for (const att of guard.guardsAttendance) {
                    if (att.type === 'P') P++;
                    else if (att.type === 'R') R++;
                    else if (att.type === 'A') A++;
                    else if (att.type === 'L') L++;
                }

                const totalRecorded = P + R + L + A;
                // const missing = totalDays - totalRecorded;
                //   A += missing; 

                           


                return {
                    id: guard.id,
                    fullName: guard.fullName,
                    serviceNumber: guard.serviceNumber,
                    fatherName: guard.fatherName,
                    assignedGuardId: guard.assignedGuard[0].id,
                    attendanceStats: {
                        P,
                        R,
                        L,
                        A
                    },
                    deductions : guard.guardDeductions,
                  };
                });

                return result;

        } catch (error) {
            handlePrismaError(error);
        }
    }


    async findGuardAttendanceByGuardId(guardId: string, organizationId: string, officeId: string | undefined , totalDays : number, date : Date) {
            try {

                const guard = await this.prisma.guard.findUnique({ where : { id  : guardId, organizationId : organizationId }});
                if(!guard) throw new NotFoundException("Guard Not Found for this organization");

                const start = startOfMonth(date);              
                const end = addMonths(start, 1);
                
                
                const guardData = await this.prisma.guard.findFirst({
                    where: {
                        id: guardId,
                        organizationId: organizationId,
                        officeId : officeId || null,
                        guardsAttendance : {
                        every : {
                            date : {
                                gte : start,
                                lt : end 
                                }  
                            } 
                        },
                    },
                    select: {
                        id: true,
                        serviceNumber: true,
                        fullName: true,
                        assignedGuard: {
                            select: {
                                guardCategory: {
                                    select: {
                                        categoryName: true,
                                    }
                                },            
                                location: {
                                    select: {
                                        id: true,
                                        locationName: true,
                                        createdLocationId: true,
                                        client: {
                                            select: {
                                                id: true,
                                                contractNumber: true,
                                                companyName: true
                                            }
                                        },                                    
                                        guardsAttendance: {
                                            select: {
                                                date: true,
                                                type: true,
                                                shift: {
                                                    select: {
                                                        shiftName: true,
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                if (!guardData) return null;

                const enrichedAssignedGuards = guardData.assignedGuard.map((assigned) => {
                    const { guardsAttendance, ...restLocation } = assigned.location;

                    const attendanceStats = guardsAttendance.reduce((stats, record) => {
                        const type = record.type;
                        stats[type] = (stats[type] || 0) + 1;
                        return stats;
                    }, { P: 0, R: 0, L: 0, A: 0 }); 


                    return {
                        ...assigned,
                        location: {
                            ...restLocation,
                            attendanceStats,
                            guardsAttendance : guardsAttendance
                        }
                    };
                });

                return {
                    ...guardData,
                    assignedGuard: enrichedAssignedGuards
                };

            } catch (error) {
                handlePrismaError(error);
            }
        }

        async generateLocationNetPayRoll(locationId : string, organizationId : string,from : Date, to : Date, officeId? : string, serviceNumber? : number ){
        try {
            const location = await this.prisma.location.findUnique({ where : { id  : locationId, organizationId : organizationId }});
            if(!location) throw new NotFoundException("Location Not Found");

            // const start = startOfMonth(date);              
            // const end = addMonths(start, 1);  
            
            const fromDate = new Date(from);
            const toDate = new Date(to);
            const totalDays = differenceInCalendarDays(toDate, fromDate);

                const guardWhereCondition: any = {
                officeId: officeId || null,
                organizationId,
                assignedGuard: {
                    some: {
                        locationId,
                    },
                },
                };

                if (serviceNumber) {
                    const guard = await this.prisma.guard.findFirst({ where : {
                        officeId: officeId || null,
                        organizationId,
                        assignedGuard: {
                            some: {
                                locationId,
                            },
                        },
                        serviceNumber : serviceNumber
                    } });

                    if(!guard) throw new NotFoundException("No guard exists with given serviceNumber")
                    guardWhereCondition.serviceNumber = serviceNumber;
                }

                const guards = await this.prisma.guard.findMany({
                where: guardWhereCondition,
                select: {
                    id: true,
                    fullName: true,
                    serviceNumber: true,
                    fatherName: true,
                    assignedGuard: {
                    select: {
                        id: true,
                        deploymentDate: true,
                        deploymentTill: true,
                        location: { 
                        select: {
                            id: true,
                            locationName: true,
                            createdLocationId: true,
                            client: {
                            select: {
                                id: true,
                                companyName: true,
                                contractNumber: true,
                            },
                            },
                        },
                        },
                        requestedGuard: {
                        select: {
                            finances: true,
                            Shift: {
                                select: { shiftName: true },
                            },
                            guardCategory: {
                                select: { categoryName: true },
                            },
                            guardAllowances : {
                                select : {
                                    overTimeCount : true,
                                    allowancePercentage : true,
                                    holidayCount : true,
                                    }
                                }
                            },
                        },
                    },
                    },
                    guardDeductions : {
                        where : {
                            locationId : locationId,
                        },
                        select :{
                            amount : true,
                            date : true,
                            guardId : true,
                            locationId : true,
                            deductionType : true
                        }
                    },
                    guardsAttendance: {
                    where: {
                        date: {
                            gte: fromDate,
                            lt: toDate,
                        },
                    },
                    },
                },
                });                    
            

                const result = guards.map(guard => {
                let P = 0, A = 0, R = 0, L = 0;

                for (const att of guard.guardsAttendance) {
                    if (att.type === 'P') P++;
                    else if (att.type === 'R') R++;
                    else if (att.type === 'A') A++;
                    else if (att.type === 'L') L++;
                }

                const totalRecorded = P + R + L + A;
                // const missing = totalDays - totalRecorded;
                //   A += missing; 

                const salaryPerDay = guard.assignedGuard[0].requestedGuard.finances!.salaryPerMonth / totalDays;
                const netSalary = salaryPerDay * P;
                const allowance = guard.assignedGuard[0].requestedGuard.guardAllowances.length != 0 ? guard.assignedGuard[0].requestedGuard.guardAllowances[0] : { overTime : 0, gazettedHoliday : 0, allowance : 0, };                    
                const providedAllowances = guard.assignedGuard[0].requestedGuard.guardAllowances.length != 0 ? {
                        overTimeAmount : guard.assignedGuard[0].requestedGuard.finances!.overtimePerHour * guard.assignedGuard[0].requestedGuard.guardAllowances[0].overTimeCount,
                        gazettedHolidayAmount : guard.assignedGuard[0].requestedGuard.finances!.gazettedHoliday! * guard.assignedGuard[0].requestedGuard.guardAllowances[0].holidayCount,
                        allowanceAmount : guard.assignedGuard[0].requestedGuard.finances!.allowance  * guard.assignedGuard[0].requestedGuard.guardAllowances[0].allowancePercentage,
                    } : {
                        overTimeAmount : 0,
                        gazettedHolidayAmount : 0,
                        allowanceAmount : 0,
                    };
                const deductionsArray = guard.guardDeductions || [];

                const deductions =
                deductionsArray.length > 0
                    ? deductionsArray.reduce((total, curr) => total + curr.amount, 0)
                    : null;   
                    
                const grossSalary = netSalary + providedAllowances.allowanceAmount + providedAllowances.gazettedHolidayAmount + providedAllowances.overTimeAmount  
                const netPayableSalary = deductions != null ? grossSalary - deductions : grossSalary ;   


                return {
                    id: guard.id,
                    fullName: guard.fullName,
                    serviceNumber: guard.serviceNumber,
                    fatherName: guard.fatherName,
                    assignedGuardId: guard.assignedGuard[0].id,
                    location : guard.assignedGuard[0].location,
                    // guardCategory : guard.assignedGuard[0].requestedGuard.guardCategory.categoryName,
                    // shift : guard.assignedGuard[0].requestedGuard.Shift.shiftName,
                    attendanceStats: {
                        P,
                        R,
                        L,
                        A
                    },
                    // guardFinances : guard.assignedGuard[0].requestedGuard.finances,
                    // allowance : allowance,
                    providedAllowances : providedAllowances,
                    deductions : guard.guardDeductions,
                    netDeductions : deductions,
                    netSalary : netSalary, // without allowance
                    grossSalary : grossSalary, // with allowance 
                    netPayableSalary : netPayableSalary // with allowance and deductions subtracted           
                  };
                });

                return result;
                // return guards;

        } catch (error) {
            handlePrismaError(error);
        }        
    }

    async processTransferTesting(username : string) {
        if (username === RolesEnum.guardSupervisor) {
            throw new Error('Transfer is not allowed');
        }

        await this.prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`);

        const tables = [
            'GuardDeductions',
            'GuardAllowances',
            'LocationPayRollDuration',
            'GuardAttendance',
            'Client',
            'Organization',
            'Guard',
            'AssignedGuard',
            'User',
        ];

            // Loop and truncate each table
        for (const table of tables) {
            await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
        }

            // Re-enable foreign key checks
        await this.prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`);

        return { message: 'All tables truncated successfully' };
    }

    async processBankTransfer(organizationId : string, locationId : string , transferType : string, from : Date, to : Date, bankId? : string ){
        try {

            let organization : any;
            if(bankId != null){
                organization = await this.prisma.organization.findUnique({ 
                where : { id  : organizationId},
                include :{
                    bankAccount  : {
                        where :{
                            id : bankId
                            }
                        }
                    }
                });
            }
            else{
                organization = await this.prisma.organization.findUnique({ 
                    where : { id  : organizationId},
                    include :{
                        bankAccount  : true
                    }
                });
            }

            if(!organization) throw new NotFoundException("Organization not found");
            if(organization.bankAccount.length == 0) throw new NotFoundException("This Bank Account doesn't exist or this organization doesn't have any account");

            const location = await this.prisma.location.findUnique({ where : { id  : locationId}});
            if(!location) throw new NotFoundException("Location Not Found");

            if (!Object.values(TransferType).includes(TransferType[transferType])) {
                throw new ForbiddenException(`Invalid Transfer type ${transferType}, valid types are IFT, IBFT `);
            }

            // const start = startOfMonth(date);              
            // const end = addMonths(start, 1);  
            
            const fromDate = new Date(from);
            const toDate = new Date(to);
            const totalDays = differenceInCalendarDays(toDate, fromDate);

            const whereQuery: any = {
                assignedGuard: {
                    some: {
                    locationId,
                    },
                },
            };

            if (transferType === TransferType.IFT.toString()) {
                whereQuery.bankAccount = {
                    bankName: organization.bankAccount[0].bankName,
                };
            }

            const guards = await this.prisma.guard.findMany({
                where: whereQuery,
                select: {
                    id: true,
                    fullName: true,
                    serviceNumber: true,
                    fatherName: true,
                    bankAccount : true,
                    assignedGuard: {
                    select: {
                        id: true,
                        deploymentDate: true,
                        deploymentTill: true,
                        location  :{
                            select : {
                                createdLocationId : true,
                            }
                        },
                        requestedGuard: {
                        select: {
                            finances: true,
                            guardAllowances : {
                                select : {
                                    overTimeCount : true,
                                    allowancePercentage : true,
                                    holidayCount : true,
                                    }
                                }
                            },
                        },
                    },
                    },
                    guardDeductions : {
                        where : {
                            locationId : locationId,
                        },
                        select :{
                            amount : true,
                            date : true,
                            guardId : true,
                            locationId : true,
                            deductionType : true
                        }
                    },
                    guardsAttendance: {
                    where: {
                        date: {
                            gte: fromDate,
                            lt: toDate,
                        },
                    },
                    },
                },
                });                    
            

                const result = guards.map(guard => {
                let P = 0, A = 0, R = 0, L = 0;

                for (const att of guard.guardsAttendance) {
                    if (att.type === 'P') P++;
                    else if (att.type === 'R') R++;
                    else if (att.type === 'A') A++;
                    else if (att.type === 'L') L++;
                }

                const totalRecorded = P + R + L + A;
                // const missing = totalDays - totalRecorded;
                //   A += missing; 

                const salaryPerDay = guard.assignedGuard[0].requestedGuard.finances!.salaryPerMonth / totalDays;
                const netSalary = salaryPerDay * P;
                const allowance = guard.assignedGuard[0].requestedGuard.guardAllowances.length != 0 ? guard.assignedGuard[0].requestedGuard.guardAllowances[0] : { overTime : 0, gazettedHoliday : 0, allowance : 0, };                    
                const providedAllowances = guard.assignedGuard[0].requestedGuard.guardAllowances.length != 0 ? {
                        overTimeAmount : guard.assignedGuard[0].requestedGuard.finances!.overtimePerHour * guard.assignedGuard[0].requestedGuard.guardAllowances[0].overTimeCount,
                        gazettedHolidayAmount : guard.assignedGuard[0].requestedGuard.finances!.gazettedHoliday! * guard.assignedGuard[0].requestedGuard.guardAllowances[0].holidayCount,
                        allowanceAmount : guard.assignedGuard[0].requestedGuard.finances!.allowance  * guard.assignedGuard[0].requestedGuard.guardAllowances[0].allowancePercentage,
                    } : {
                        overTimeAmount : 0,
                        gazettedHolidayAmount : 0,
                        allowanceAmount : 0,
                    };
                const deductionsArray = guard.guardDeductions || [];

                const deductions =
                deductionsArray.length > 0
                    ? deductionsArray.reduce((total, curr) => total + curr.amount, 0)
                    : null;   
                    
                const grossSalary = netSalary + providedAllowances.allowanceAmount + providedAllowances.gazettedHolidayAmount + providedAllowances.overTimeAmount  
                const netPayableSalary = deductions != null ? grossSalary - deductions : grossSalary ;   


                return {
                    id: guard.id,
                    fullName: guard.fullName,
                    serviceNumber: guard.serviceNumber,
                    fatherName: guard.fatherName,
                    guardAccountNumber: guard.bankAccount?.accountTitle,
                    guardAccountTitle: guard.bankAccount?.accountNumber,
                    guardBankCode: guard.bankAccount?.bankCode,
                    companyAccountNumber: organization.bankAccount[0].accountNumber,
                    amount : netPayableSalary, // with allowance and deductions subtracted
                    transferReferenceId : `${guard.assignedGuard[0].location.createdLocationId} ${guard.serviceNumber}`
                };
                });

                return result;
            
        } catch (error) {
            handlePrismaError(error);
        }
    }
}

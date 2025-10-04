import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuardAttendanceDto } from './dto/create-guard-attendance.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { AttendanceEnum } from 'src/common/enums/attendance-enum';
import { startOfDay, addDays, startOfMonth, addMonths, differenceInCalendarDays } from 'date-fns';
import { UpdateGuardAttendanceDto } from './dto/update-guard-attendance.dto';

@Injectable()
export class AttendanceService {

    constructor(private readonly prisma : PrismaService){}

    async create(dtoList : CreateGuardAttendanceDto[], organizationId : string){
        try {

            const errors : string[] = [];
            const validDtos : CreateGuardAttendanceDto[] = [];

            for (const dto of dtoList) {
                    const guard = await this.prisma.guard.findUnique({ where : { id : dto.guardId, organizationId : organizationId }});
                    const location = await this.prisma.location.findUnique({ where : { id : dto.locationId, organizationId : organizationId }});
                    const assignedGuard = await this.prisma.assignedGuard.findFirst({ where : { guardId : dto.guardId, locationId : dto.locationId }});

                    if(!guard) throw new NotFoundException("Guard Not Found");
                    if(!location) throw new NotFoundException("Location Not Found");
                    if(!assignedGuard) throw new NotFoundException("Guard is not assigned to this location");

                    const start = startOfDay(dto.date);
                    const end = addDays(start, 1);

                    const existing = await this.prisma.guardsAttendance.findFirst({
                        where: {
                            guardId: dto.guardId,
                            date: {
                                gte: start,
                                lt: end,
                            },
                        },
                    });
                    if (existing) {
                        throw new ForbiddenException(`Duplicate: Attendance for guard ${dto.guardId} on ${dto.date} already exists`);
                    }
                    if (!Object.values(AttendanceEnum).includes(AttendanceEnum[dto.type])) {
                        throw new ForbiddenException(`Invalid attendance type ${dto.type} for guard ${dto.guardId}`);
                    }

                    validDtos.push({
                        ...dto,
                        type: AttendanceEnum[dto.type],
                    });
            }
                    
            const attendance = await this.prisma.guardsAttendance.createMany({
                    data: validDtos,
                    skipDuplicates: true,
            });

            return {
                message: 'Guard attendance processed',
                createdCount: attendance.count,
            };
            
        } catch (error) {
            handlePrismaError(error);
        }
    }


    async update(dtoList : UpdateGuardAttendanceDto[], organizationId : string){
        try {

            const errors : string[] = [];
            const validDtos : UpdateGuardAttendanceDto[] = [];
            for (const dto of dtoList) {
                    const existing = await this.prisma.guardsAttendance.findFirst({
                        where: {
                            id : dto.id 
                        },
                    });
                    if (!existing) {
                        throw new NotFoundException(`Attendance for guard ${dto.guardId} on ${dto.date} does not exist`);
                    }
                    if (!Object.values(AttendanceEnum).includes(AttendanceEnum[dto.type!])) {
                        throw new ForbiddenException(`Invalid attendance type ${dto.type} for guard ${dto.guardId}`);
                    }

                    validDtos.push({
                        ...dto,
                        type: AttendanceEnum[dto.type!],
                    });
            }
                    
            const attendance = await this.prisma.guardsAttendance.updateManyAndReturn({
                    data: validDtos,
            });

            return attendance;
            
        } catch (error) {
            handlePrismaError(error);
        }
    }



    async findAll(organizationId : string){
        try {
            return await this.prisma.guardsAttendance.findMany({
                where : { 
                    location : {
                        organizationId : organizationId
                    }                
                }
            });
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async findGuardAttendanceByLocationId(locationId : string,organizationId : string, from : Date, to : Date, serviceNumber? : number, officeId? : string,){
        try {

            const location = await this.prisma.location.findUnique({ where : { id  : locationId, organizationId : organizationId }});
            if(!location) throw new NotFoundException("Location Not Found");


            // const start = startOfMonth(date);              
            // const end = addMonths(start, 1); 

            const fromDate = new Date(from);
            const toDate = new Date(to);

            console.log(fromDate); 
            console.log(toDate);     

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
                guardWhereCondition.serviceNumber = serviceNumber;
                const guard = await this.prisma.guard.findFirst({ where : guardWhereCondition });
                if(!guard) throw new NotFoundException("No guard exists with given serviceNumber")
            }
            
            const guards =  await this.prisma.guard.findMany({
                where : guardWhereCondition,
                select : {
                    id : true,
                    fullName : true,
                    serviceNumber : true,
                    fatherName : true,
                    organizationId : true,
                    officeId : true,
                    assignedGuard :{
                        select : {
                            deploymentDate : true,
                            deploymentTill : true,
                        }
                    },
                    guardsAttendance : {
                        where : {
                             date : {
                                gte : fromDate,
                                lte : toDate 
                            }  
                        }
                    }
                }
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
                //   const missing = totalDays - totalRecorded;
                //   A += missing; 

                return {                    
                    id: guard.id,
                    organizationId: guard.organizationId,
                    officeId: guard.officeId,
                    fullName: guard.fullName,
                    serviceNumber: guard.serviceNumber,
                    fatherName: guard.fatherName,
                    assignedGuard : guard.assignedGuard,
                    attendanceStats: {
                        P,
                        R,
                        L,
                        A
                    },
                    guardAttendance : guard.guardsAttendance,
                };
                });

                return {
                    dateRange : { 
                        from : fromDate,
                        to : toDate,
                        totalDays, 
                    },
                    result,
                };                

        } catch (error) {
            handlePrismaError(error);
        }
    }
        

    async deleteGuardAttendance(attendanceId : string){
        try {
            const attendance = await this.prisma.guardsAttendance.findUnique({where : { id : attendanceId }});
            if(!attendance) throw new NotFoundException("Attendance Not Found");

            await this.prisma.guardsAttendance.delete({ where : { id : attendanceId }});
        } catch (error) {
            handlePrismaError(error);   
        }
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateGuardDto } from 'src/guard/dto/update-guard-dto';
import { UserService } from 'src/user/user.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { RolesEnum } from 'src/common/enums/roles-enum';
import { NotFoundError } from 'rxjs';
import { AssignSupervisorDto } from './dto/assign-supervisor.dto';
import { UpdateAssignSupervisorDto } from './dto/update-assign-supervisor.dto';

@Injectable()
export class EmployeeService {

  constructor(private readonly prisma: PrismaService, private readonly user: UserService) {}

  async create(data: CreateEmployeeDto, organizationId: string) {
    try {
      // Get next service number
      const lastEmployee = await this.prisma.employee.findFirst({
        where: { organizationId },
        orderBy: { serviceNumber: 'desc' },
      });

      const nextServiceNumber = lastEmployee ? lastEmployee.serviceNumber + 1 : 1;

      // Prepare create data object
      const createData: any = {
        ...data,
        serviceNumber: nextServiceNumber,
        userId: null,
        organizationId,
      };

            // Add relations if they exist
      if (data.academic) {
        createData.academic = { create: data.academic };
      }

      if (data.drivingLicense) {
        createData.drivingLicense = { create: data.drivingLicense };
      }

      if (data.bankAccount) {
        createData.bankAccount = { create: data.bankAccount };
      }

      if (data.employeeDocuments) {
        createData.employeeDocuments = { create: data.employeeDocuments };
      }

      // Handle optional relations with proper checks
      if (Array.isArray(data.employeeExperience)) {
        createData.employeeExperience = data.employeeExperience.length > 0 
          ? { create: data.employeeExperience }
          : undefined;
      }

      // Handle references - properly handle empty array case
      if (Array.isArray(data.references)) {
        createData.references = data.references.length > 0 
          ? {
              create: data.references.map(ref => ({
                fullName: ref.name || '',
                fatherName: ref.fatherName || '',
                cnicNumber: ref.cnicNumber || '',
                contactNumber: ref.contactNumber || '',
                currentAddress: ref.currentAddress || '',
                permanentAddress: ref.permanentAddress || '',
                cnicFront: ref.cnicFront || '',
                cnicBack: ref.cnicBack || ''
              }))
            }
          : undefined;
      }

      // Handle optional biometric data
      if (data.biometric) {
        // Only create biometric if at least one field has a value
        const hasBiometricData = Object.values(data.biometric).some(value => value !== '' && value !== undefined && value !== null);
        createData.biometric = hasBiometricData ? { create: data.biometric } : undefined;
      }

      // Create employee with prepared data
      return await this.prisma.employee.create({
        data: createData,
        include: {
          academic: true,
          drivingLicense: true,
          employeeExperience: true,
          references: true,
          bankAccount: true,
          biometric: true,
          employeeDocuments: true
        }
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

    
  

  findAll() {
    return this.prisma.employee.findMany({
      include: {
        academic: true,
        drivingLicense: true,
        employeeExperience: true,
        references: true,
        bankAccount: true,
        biometric: true,
      },
    });
  }

  async findAllSupervisors(organizationId : string) {
    try {
       const supervisorRole = await this.prisma.role.findFirst({
          where : { roleName : RolesEnum.supervisor }
        });

        if(!supervisorRole) throw new NotFoundException("supervisor role doesn't exist");
        

        return this.prisma.employee.findMany({
          where : { 
            organizationId : organizationId,
            user : {
              userRoles : {
                some: {
                  roleId: supervisorRole?.id,
                },
              }
            }
          },
          include: {
            academic: true,
            drivingLicense: true,
            employeeExperience: true,
            references: true,
            bankAccount: true,
            biometric: true,
          },
        }); 
      
    } catch (error) {
      handlePrismaError(error);
    }
  }
  

  findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        academic: true,
        drivingLicense: true,
        employeeExperience: true,
        references: true,
        bankAccount: true,
        biometric: true,
      },
    });
  }

  findEmployeeByOrganizationId(organizationId: string) {
    return this.prisma.employee.findMany({
      where: { organizationId : organizationId },
      include: {
        academic: true,
        drivingLicense: true,
        employeeExperience: true,
        references: true,
        bankAccount: true,
        biometric: true,
      },
    });
  }
  

  async update(id: string, data: UpdateEmployeeDto) {
    const {
      academic,
      drivingLicense,
      employeeExperience,
      references,
      bankAccount,
      employeeDocuments,
      biometric,
      ...guardData
    } = data;
  
    const updatedGuard = await this.prisma.employee.update({
      where: { id },
      data: guardData,
    });
  
    if (academic) {
      await this.prisma.academic.update({
        where: { guardId: id },
        data: academic,
      });
    }
  
    if (drivingLicense) {
      await this.prisma.drivingLicense.update({
        where: { guardId: id },
        data: drivingLicense,
      });
    }
  
    if (bankAccount) {
      await this.prisma.bankAccount.update({
        where: { guardId: id },
        data: bankAccount,
      });
    }
  
    // Handle optional biometric data
    if (biometric && Object.values(biometric).some(value => value !== '')) {
      const existingBiometric = await this.prisma.biometric.findUnique({
        where: { guardId: id }
      });
      
      if (existingBiometric) {
        await this.prisma.biometric.update({
          where: { guardId: id },
          data: biometric,
        });
      } else {
        await this.prisma.biometric.create({
          data: {
            ...biometric,
            guardId: id
          }
        });
      }
    }

    if (employeeExperience && employeeExperience.length > 0) {
      await this.prisma.employeeExperience.deleteMany({
        where: { employeeId: id },
      });
  
      await this.prisma.employeeExperience.createMany({
        data: employeeExperience.map((exp) => ({ ...exp, guardId: id })),
      });
    }
  
    if (references && references.length > 0) {
      // First delete existing references
      await this.prisma.reference.deleteMany({
        where: { guardId: id },
      });
  
      // Then create new references with the correct field mapping
      await this.prisma.reference.createMany({
        data: references.map((ref) => ({
          guardId: id,
          fullName: ref.name || '', // Map name to fullName
          fatherName: ref.fatherName || '',
          cnicNumber: ref.cnicNumber || '',
          contactNumber: ref.contactNumber || '',
          currentAddress: ref.currentAddress || '',
          permanentAddress: ref.permanentAddress || '',
          cnicFront: ref.cnicFront || '',
          cnicBack: ref.cnicBack || ''
        })),
      });
    }
    
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        academic: true,
        drivingLicense: true,
        employeeExperience: true,
        references: true,
        bankAccount: true,
        biometric: true,
      },
    });
  }
  

  remove(id: string) {
    return this.prisma.employee.delete({ where: { id } });
  }

  //#region : ASSIGN SUPERVISOR
    async assignSupervisor(dto : AssignSupervisorDto, organizationId : string){
      try {
        const location = await this.prisma.location.findUnique({where : { id : dto.locationId, clientId : dto.clientId ,organizationId : organizationId }});
        const client = await this.prisma.client.findUnique({where : { id : dto.clientId, organizationId : organizationId }});
        if(!location) throw new NotFoundException("Location doesn't exist for this organization");
        if(!client) throw new NotFoundException("Client doesn't exist for this organization");
        //constraints ?
        const assignSupervisor =  await this.prisma.assignedSupervisor.create({ 
          data : { 
            ...dto,
            deploymentDate: new Date(), 
          }, 
          include : { 
            location : true, 
            client: true,
            guard: true
          }
        });
        return assignSupervisor;
      } catch (error) {
        handlePrismaError(error);
      }
    }

    async updateAssignedSupervisor(dto : UpdateAssignSupervisorDto ,assignSupervisorId : string, organizationId : string){
      try {

        const assignedSupervisor = await this.prisma.assignedSupervisor.findUnique({ where : { id : assignSupervisorId }});

        if(!assignedSupervisor) throw new NotFoundException("Assigned Supervisor not found");
        
        if(dto.employeeId){
          const employee = await this.prisma.employee.findUnique({where : { id : dto.employeeId, organizationId : organizationId }});
          if(!employee) throw new NotFoundException("Employee doesn't exist for this organization");
        }

        if(dto.locationId){
          const location = await this.prisma.location.findUnique({where : { id : dto.locationId, clientId : dto.clientId ,organizationId : organizationId }});
          if(!location) throw new NotFoundException("Location doesn't exist for this organization");
        } 

        if(dto.clientId){
          const client = await this.prisma.client.findUnique({where : { id : dto.clientId, organizationId : organizationId }});
          if(!client) throw new NotFoundException("Client doesn't exist for this organization");
        } 
  
        
        const updatedAssignSupervisor =  await this.prisma.assignedSupervisor.update({
          where : { id : assignSupervisorId },
          data : { 
            ...dto,
          }, 
          include : { 
            location : true, 
            client: true,
            employee : true
          }
        });
  
        return updatedAssignSupervisor;
  
      } catch (error) {
        handlePrismaError(error);
      }
    }

      async getAssignedSupervisorsByEmployeeId(employeeId: string, organizationId: string) {
          try {
            const assignedSupervisors = await this.prisma.assignedSupervisor.findMany({
              where: {
                employeeId: employeeId,
                deploymentTill : null,
                location: {
                  organizationId: organizationId
                },
                // isActive: true
              },
              include: {
                location: {
                  select: {
                    id: true,
                    locationName: true,
                    createdLocationId: true,
                  },
                },
                client: {
                  select: {
                    id: true,
                    contractNumber: true,
                    companyName: true,
                  }
                },
                employee: {
                  select: {
                    id: true,
                    serviceNumber: true,
                    fullName: true,
                  }
                }
              },
            });

            if (!assignedSupervisors || assignedSupervisors.length === 0) return [];

            const result = assignedSupervisors.map((supervisor) => {
               let totalWorkingDays: number | null = null;

              if (supervisor.deploymentDate) {
                const deploymentDate = new Date(supervisor.deploymentDate);
                const deploymentTill = supervisor.deploymentTill
                  ? new Date(supervisor.deploymentTill)
                  : new Date(); 

                const timeDiff = deploymentTill.getTime() - deploymentDate.getTime();
                totalWorkingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 
              }

              return {
                ...supervisor,
                totalWorkingDays,
              };
            });

            return result;
          } catch (error) {
            handlePrismaError(error);
          }
      }



  //#endregion

}




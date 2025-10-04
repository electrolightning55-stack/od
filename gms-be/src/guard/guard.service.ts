// ...existing code...
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuardDto } from './dto/create-guard-dto';
import { UpdateGuardDto } from './dto/update-guard-dto';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileService } from 'src/file/file.service';
import { AssignGuardDto } from './dto/assigned-guard-dto';

@Injectable()
export class GuardService {
  constructor(  private readonly fileService: FileService , private readonly prisma: PrismaService) {}

  async bulkUploadGuards(organizationId: string, officeId: string, guards: any[]) {
    if (!Array.isArray(guards) || guards.length === 0) {
      return { success: false, message: 'No guards data provided.' };
    }
    // Validate and map guards
    const requiredFields = ['fullName', 'cnicNumber', 'cnicIssueDate', 'height', 'serviceNumber'];
    const now = new Date();
    type GuardInput = {
      id?: string;
      organizationId: string;
      officeId?: string;
      registrationDate?: Date;
      fullName: string;
      fatherName?: string;
      dateOfBirth?: Date | null;
      cnicNumber: string;
      cnicIssueDate: Date;
      currentAddress?: string;
      permanentAddress?: string;
      weight?: number | null;
      height: number;
      religion?: string;
      bloodGroup?: string;
      bloodPressure?: string;
      heartBeat?: string;
      eyeColor?: string;
      disability?: string;
      eobiNumber?: string;
      sessiNumber?: string;
      kinName?: string;
      kinFatherName?: string;
      kinCNIC?: string;
      serviceNumber: number;
      cnicExpiryDate?: Date | null;
      contactNumber?: string;
      currentAreaPoliceContact?: string;
      currentAreaPoliceStation?: string;
      kinRelation?: string;
      permanentAreaPoliceContact?: string;
      permanentAreaPoliceStation?: string;
      religionSect?: string;
      kinContactNumber?: string;
      createdAt: Date;
      isActive: boolean;
      updatedAt: Date;
    };
    const guardsToCreate: GuardInput[] = [];
    const errors: { row: number; missing: string[] }[] = [];
    for (let i = 0; i < guards.length; i++) {
      const g = guards[i];
      const missing = requiredFields.filter(f => !g[f]);
      if (missing.length > 0) {
        errors.push({ row: i + 1, missing });
        continue;
      }
      guardsToCreate.push({
        id: undefined,
        organizationId,
        officeId,
        registrationDate: g.registrationDate ? new Date(g.registrationDate) : now,
        fullName: g.fullName,
        fatherName: g.fatherName || '',
        dateOfBirth: g.dateOfBirth ? new Date(g.dateOfBirth) : null,
        cnicNumber: g.cnicNumber,
        cnicIssueDate: new Date(g.cnicIssueDate),
        currentAddress: g.currentAddress || '',
        permanentAddress: g.permanentAddress || '',
        weight: g.weight ? Number(g.weight) : null,
        height: Number(g.height),
        religion: g.religion || '',
        bloodGroup: g.bloodGroup || '',
        bloodPressure: g.bloodPressure || '120/80',
        heartBeat: g.heartBeat || '',
        eyeColor: g.eyeColor || '',
        disability: g.disability || '',
        eobiNumber: g.eobiNumber || '',
        sessiNumber: g.sessiNumber || '',
        kinName: g.kinName || '',
        kinFatherName: g.kinFatherName || '',
        kinCNIC: g.kinCNIC || '',
        serviceNumber: Number(g.serviceNumber),
        cnicExpiryDate: g.cnicExpiryDate ? new Date(g.cnicExpiryDate) : null,
        contactNumber: g.contactNumber || 'N/A',
        currentAreaPoliceContact: g.currentAreaPoliceContact || 'N/A',
        currentAreaPoliceStation: g.currentAreaPoliceStation || 'N/A',
        kinRelation: g.kinRelation || 'N/A',
        permanentAreaPoliceContact: g.permanentAreaPoliceContact || 'N/A',
        permanentAreaPoliceStation: g.permanentAreaPoliceStation || 'N/A',
        religionSect: g.religionSect || 'N/A',
        kinContactNumber: g.kinContactNumber || 'N/A',
        createdAt: now,
        isActive: true,
        updatedAt: now,
      });
    }
    if (errors.length > 0) {
      return { success: false, errors };
    }
    try {
      const result = await this.prisma.guard.createMany({
        data: guardsToCreate,
        skipDuplicates: true,
      });
      return { success: true, count: result.count };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async create(data: CreateGuardDto, organizationId: string) {
    try {

      
      if(!data.serviceNumber){
        const lastGuard = await this.prisma.guard.findFirst({
          where: { organizationId },
          orderBy: { serviceNumber: 'desc' },
        });
        data.serviceNumber = lastGuard ? lastGuard.serviceNumber + 1 : 1;
      }
      
  
      return await this.prisma.guard.create({
        data: {
          ...data,
          organizationId,
          serviceNumber: data.serviceNumber,
          academic: { create: data.academic },
          drivingLicense: { create: data.drivingLicense },
          guardExperience: { create: data.guardExperience },
          references: data.references ? {
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
          } : undefined,
          bankAccount: { create: data.bankAccount },
          guardDocuments: { create : data.guardDocuments },
          biometric: data.biometric ? { create: data.biometric } : undefined,
        },
        include: {
          academic: true,
          drivingLicense: true,
          guardExperience: true,
          references: true,
          bankAccount: true,
          guardDocuments : true,
          biometric: true,
        },
      });
    } catch (error) {
      handlePrismaError(error); 
    }
  }
  
  

  findAll() {
    return this.prisma.guard.findMany({
      include: {
        academic: true,
        drivingLicense: true,
        guardExperience: true,
        references: true,
        bankAccount: true,
        guardDocuments : true,
        biometric: true,
      },
    });
  }
  


    async findOne(id: string, organizationId : string) {
      const guard = await this.prisma.guard.findUnique({
        where: { id : id , organizationId : organizationId },
        include: {
          academic: true,
          drivingLicense: true,
          guardExperience: true,
          references: true,
          bankAccount: true,
          guardDocuments: true,
          biometric: true,
        },
      });

      if (!guard) return new NotFoundException("Guard doesn't exist");

      if(guard.guardDocuments){
          const documentFields = [
          'picture',
          'cnicFront',
          'cnicBack',
          'licenseFront',
          'licenseBack',
        ];

        const signedDocumentUrls: Record<string, string> = {};

        if (guard.guardDocuments) {
          await Promise.all(
            documentFields.map(async (field) => {
              const docs = guard.guardDocuments;
                signedDocumentUrls["picture"] = await this.fileService.getSecureDownloadUrl(docs!.picture);
                signedDocumentUrls["cnicFront"] = await this.fileService.getSecureDownloadUrl(docs!.cnicFront);
                signedDocumentUrls["cnicBack"] = await this.fileService.getSecureDownloadUrl(docs!.cnicBack);
                docs?.licenseFront != null ? signedDocumentUrls["licenseFront"] = await this.fileService.getSecureDownloadUrl(docs?.licenseFront): null;
                docs?.licenseBack != null ? signedDocumentUrls["licenseBack"] = await this.fileService.getSecureDownloadUrl(docs?.licenseBack) : null;
            })
          );
        }

        return {
          ...guard,
          documentUrls: signedDocumentUrls,
        };

      }
      else{
        return guard;
      }
  }



    async findByServiceNumber(serviceNumber: number, organizationId : string) {
      try {
        const guard = await this.prisma.guard.findFirst({
        where: { serviceNumber : serviceNumber , organizationId : organizationId },
        include: {
          academic: true,
          drivingLicense: true,
          guardExperience: true,
          references: true,
          bankAccount: true,
          guardDocuments: true,
          biometric: true,
        },
      });

      if (!guard) throw new NotFoundException("Guard doesn't exist");

      // if(guard.guardDocuments){
      //     const documentFields = [
      //     'picture',
      //     'cnicFront',
      //     'cnicBack',
      //     'licenseFront',
      //     'licenseBack',
      //   ];

        // const signedDocumentUrls: Record<string, string> = {};

        // if (guard.guardDocuments) {
        //   await Promise.all(
        //     documentFields.map(async (field) => {
        //       const docs = guard.guardDocuments;
        //         signedDocumentUrls["picture"] = await this.fileService.getSecureDownloadUrl(docs!.picture);
        //         signedDocumentUrls["cnicFront"] = await this.fileService.getSecureDownloadUrl(docs!.cnicFront);
        //         signedDocumentUrls["cnicBack"] = await this.fileService.getSecureDownloadUrl(docs!.cnicBack);
        //         docs?.licenseFront != null ? signedDocumentUrls["licenseFront"] = await this.fileService.getSecureDownloadUrl(docs?.licenseFront): null;
        //         docs?.licenseBack != null ? signedDocumentUrls["licenseBack"] = await this.fileService.getSecureDownloadUrl(docs?.licenseBack) : null;
        //     })
        //   );
        // }

      //   return {
      //     ...guard,
      //   };

      // }
      // else{
        return guard;
      // }
        
      } catch (error) {
        handlePrismaError(error);
      }
      
  }



  findGuardsByOrganizationId(organizationId: string) {
    return this.prisma.guard.findMany({
      where: { 
        organizationId : organizationId,
        isActive : true 
      },
      include: {
        academic: true,
        drivingLicense: true,
        guardExperience: true,
        references: true,
        bankAccount: true,
        guardDocuments : true,
        biometric: true,
        assignedGuard : {
          include : {
            requestedGuard :{
                  select : {
                    id : true,
                    guardCategory : {
                      select : {
                        categoryName : true
                      }
                    }
                  }
                },
            location : {
              select : {
                id : true,
                locationName : true,
                createdLocationId: true,
                city : true,
                provinceState : true,
              },
            }
          }
        }
      },
    });
  }

  findGuardsWithAssignedLocations(organizationId: string) {
    return this.prisma.guard.findMany({
      where: { 
        organizationId : organizationId,
        isActive : true 
      },
      select: {
        id: true,
        organizationId: true,   
        officeId: true,
        isActive : true,  
        serviceNumber: true,
        registrationDate: true,
        fullName: true,
        fatherName: true,
        dateOfBirth: true,
        cnicNumber: true,
        cnicIssueDate: true,
        cnicExpiryDate: true,
        contactNumber: true,
        currentAddress: true,
        assignedGuard : {
          select : {
            requestedGuard :{
                  select : {
                    id : true,
                    guardCategory : {
                      select : {
                        categoryName : true
                      }
                    },
                    location : {
                      select : {
                        id : true,
                        locationName : true,
                        createdLocationId: true,
                      },
                    }
                  }
                },
          }
        }
      },
    });
  }
  

  async update(id: string, data: UpdateGuardDto) {

     const guard = await this.prisma.guard.findUnique({
        where: { id }})

    if(!guard){
      throw new NotFoundException("guard doesn't exist");
    }

    // Destructure nested fields
    const {
      academic,
      drivingLicense,
      guardExperience,
      references,
      bankAccount,
      biometric,
      guardDocuments,
      ...guardData
    } = data;
  
    // Update Guard main data
    const updatedGuard = await this.prisma.guard.update({
      where: { id },
      data: guardData,
    });
  
    // Update related data conditionally
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
  
    if (biometric) {
      await this.prisma.biometric.update({
        where: { guardId: id },
        data: biometric,
      });
    }
  
    if (guardExperience && guardExperience.length > 0) {
      await this.prisma.guardExperience.deleteMany({
        where: { guardId: id },
      });
  
      await this.prisma.guardExperience.createMany({
        data: guardExperience.map((exp) => ({ ...exp, guardId: id })),
      });
    }
  
    if (references && references.length > 0) {
      await this.prisma.reference.deleteMany({
        where: { guardId: id },
      });
  
      await this.prisma.reference.createMany({
        data: references.map((ref) => ({
          guardId: id,
          fullName: ref.name || '',
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
    
    return this.prisma.guard.findUnique({
      where: { id },
      include: {
        academic: true,
        drivingLicense: true,
        guardExperience: true,
        references: true,
        bankAccount: true,
        guardDocuments : true,
        biometric: true,
      },
    });
  }
  

  async remove(id: string) {
    const isExist  = await this.prisma.guard.findFirst({ where: { id } });
    if(!isExist){
      throw new NotFoundException("guard doesn't exist");

    }
    return this.prisma.guard.delete({ where: { id } });
  }

  //#region : ASSIGN GUARD
  async assignGuard(dto : AssignGuardDto, organizationId : string){
    try {
      const guard = await this.prisma.guard.findUnique({where : { id : dto.guardId, organizationId : organizationId }});
      const location = await this.prisma.location.findUnique({where : { id : dto.locationId, organizationId : organizationId }});
      const requestedGuard = await this.prisma.requestedGuard.findUnique({where : { id : dto.requestedGuardId, locationId : dto.locationId }});

      if(!guard) throw new NotFoundException("Guard doesn't exist for this organization");
      if(!location) throw new NotFoundException("Location doesn't exist for this organization");
      if(!requestedGuard) throw new NotFoundException("Requested Guard doesn't exist for this location");

      // quantity constraint
      if(requestedGuard){
        const quantity = requestedGuard.quantity;
        const assignedGuard = await this.prisma.assignedGuard.findMany({ where : { requestedGuardId : dto.requestedGuardId }});
        if (assignedGuard.length >= quantity){
          throw new ForbiddenException("Guards are fully assigned to this requested location, either create new request or update the quantity");
        }
      }

      //location constraint

      const existingAssignedGuard = await this.prisma.assignedGuard.findFirst({
        where: {
          requestedGuardId: dto.requestedGuardId,
        },
        // orderBy: {
        //   createdAt: 'desc', // optional: get the most recent assignment
        // },
      });

      const now = new Date();

      if (existingAssignedGuard) {
        const { deploymentTill } = existingAssignedGuard;

        if (deploymentTill === null) {
          // Case 1: No deployment end date, so we must end it now.
          await this.prisma.assignedGuard.update({
            where: { id: existingAssignedGuard.id },
            data: { deploymentTill: now },
          });
        } else if (deploymentTill > now || deploymentTill.getTime() === now.getTime()) {
          // Case 2 & 3: Still deployed (future or exactly now), force end it now.
          await this.prisma.assignedGuard.update({
            where: { id: existingAssignedGuard.id },
            data: { deploymentTill: now },
          });
        }
        // Case 4 (deploymentTill < now): No update needed; already ended.
      }  
                

      const assignGuard =  await this.prisma.assignedGuard.create({ 
        data : { 
          ...dto,
          deploymentDate: new Date(), 
        }, 
        include : { 
          location : true, 
          requestedGuard: {
          include: {
              finances: true
            }
          }
          // guardCategory : true,
          // guard : true
        }
      });

      return assignGuard;

    } catch (error) {
      handlePrismaError(error);
    }
  }


  async getAssignedGuardByGuardId(guardId: string, organizationId: string ) {
    try {
      if (!organizationId) {
        console.error('[getAssignedGuardByGuardId] Missing organizationId');
        throw new ForbiddenException('Organization ID is required');
      }
      if (!guardId) {
        console.error('[getAssignedGuardByGuardId] Missing guardId');
        throw new ForbiddenException('Guard ID is required');
      }
      const assignedGuard = await this.prisma.assignedGuard.findFirst({
        where: {
          guardId: guardId,
          location: {
            organizationId: organizationId,
          },
        },
        include: {
          location: {
            include: {
              client: {
                select: {
                  id: true,
                  companyName: true,
                  contractNumber: true,
                },
              },
            },
          },
        },
      });

      if (!assignedGuard) {
        throw new NotFoundException('Assigned guard not found for this organization and guard ID');
      }

      let totalWorkingDays: number | null = null;
      if (assignedGuard.deploymentDate) {
        const deploymentDate = new Date(assignedGuard.deploymentDate);
        const deploymentTill = assignedGuard.deploymentTill
          ? new Date(assignedGuard.deploymentTill)
          : new Date();
        const timeDiff = deploymentTill.getTime() - deploymentDate.getTime();
        totalWorkingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      }

      // Flatten and return relevant info for frontend best practice
      return {
        id: assignedGuard.id,
        guardId: assignedGuard.guardId,
        locationId: assignedGuard.locationId,
        requestedGuardId: assignedGuard.requestedGuardId,
        deploymentDate: assignedGuard.deploymentDate,
        deploymentTill: assignedGuard.deploymentTill,
        guardCategoryId: assignedGuard.guardCategoryId,
        totalWorkingDays,
        clientName: assignedGuard.location?.client?.companyName || null,
        clientContractNumber: assignedGuard.location?.client?.contractNumber || null,
        locationName: assignedGuard.location?.locationName || null,
      };
    } catch (error) {
      handlePrismaError(error);
      // Defensive: If handlePrismaError does not throw, throw generic error
      throw new ForbiddenException('Failed to fetch assigned guard');
    }
  }
  //#endregion 

    /**
     * Promote an assigned guard to supervisor: assigns 'guardSupervisor' role to guard's user, creates assignment record
     */
    async promoteGuardToSupervisor(guardId: string, dto: any, organizationId: string) {
      // 1. Find the guard
      const guard = await this.prisma.guard.findUnique({ where: { id: guardId, organizationId } });
      if (!guard) throw new NotFoundException("Guard doesn't exist for this organization");


      // 2. Get the userId linked to this guard (if exists)
      // If guard has a userId field, assign supervisor role (skip if not present)
      if ('userId' in guard && typeof guard['userId'] === 'string' && guard['userId']) {
        const userId: string = guard['userId'];
        const supervisorRole = await this.prisma.role.findFirst({ where: { roleName: 'guardSupervisor' } });
        if (supervisorRole) {
          const existingUserRole = await this.prisma.userRole.findFirst({ where: { userId: userId, roleId: supervisorRole.id } });
          if (!existingUserRole) {
            await this.prisma.userRole.create({ data: { userId: userId, roleId: supervisorRole.id } });
          }
        }
      }

      // 5. Create assignment record in assignedSupervisor table
      // Validate required fields in dto
      if (!dto.locationId || !dto.clientId) throw new NotFoundException("locationId and clientId are required in body");

      // Check if already assigned as supervisor for this location/client
        const alreadyAssigned = await this.prisma.assignedSupervisor.findFirst({
          where: {
            guardId: guard.id,
            locationId: dto.locationId,
            clientId: dto.clientId,
            deploymentTill: null
          }
        });
      if (alreadyAssigned) {
        return { message: "Guard is already assigned as supervisor for this location and client", assignedSupervisor: alreadyAssigned };
      }

      // Create assignment
        const assignSupervisor = await this.prisma.assignedSupervisor.create({
          data: {
            locationId: dto.locationId,
            guardId: guard.id,
            employeeId: null,
            clientId: dto.clientId,
            deploymentDate: new Date(),
          },
          include: {
            location: true,
            client: true,
            guard: true
          }
        });

      return { message: "Guard promoted to supervisor and assigned successfully", assignedSupervisor: assignSupervisor };
    }
}



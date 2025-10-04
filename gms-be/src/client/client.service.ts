import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClientDto, organizationId: string) {
    try {
        console.log('Creating client with data:', { ...data, organizationId });

        // Check for existing email first
        const existingUser = await this.prisma.client.findUnique({
            where: { officialEmail: data.officialEmail },
        });
        if (existingUser) {
            throw new ConflictException('A client with this email already exists');
        }

        // Handle contract number

    let finalContractNumber: number;
    if (!data.contractNumber || data.contractNumber.trim() === '') {
      console.log('Generating auto contract number');
      // Auto-generate contract number
      const lastClient = await this.prisma.client.findFirst({
        where: { organizationId },
        orderBy: { contractNumber: 'desc' },
      });
      finalContractNumber = lastClient ? Number(lastClient.contractNumber) + 1 : 1;
      console.log('Generated contract number:', finalContractNumber.toString());
    } else {
      console.log('Validating provided contract number:', data.contractNumber);
      try {
        // Validate contract number format and length
        if (!/^\d{1,15}$/.test(data.contractNumber)) {
          throw new ConflictException('Contract number must be 1-15 digits');
        }
        finalContractNumber = Number(data.contractNumber);
        if (isNaN(finalContractNumber)) {
          throw new ConflictException('Contract number is not a valid number');
        }
        // Check if contract number already exists
        const existingContract = await this.prisma.client.findFirst({
          where: { 
            contractNumber: finalContractNumber,
            organizationId 
          }
        });
        if (existingContract) {
          throw new ConflictException('This contract number is already in use');
        }

        // Additional validation for reasonable limits
        if (finalContractNumber <= 0) {
          throw new ConflictException('Contract number must be positive');
        }
      } catch (error) {
        console.error('Contract number validation error:', error);
        if (error instanceof ConflictException) {
          throw error;
        }
        throw new ConflictException('Invalid contract number format');
      }
    }


    // Remove contractNumber from data to avoid duplication
    const { contractNumber: _, ...clientData } = data;

    // Prepare final data
    const createData = {
      ...clientData,
      contractNumber: finalContractNumber,
      organizationId,
    };

        console.log('Final create data:', createData);

        // Create client with validated data
        const result = await this.prisma.client.create({
            data: createData,
            include: {
                organization: true,
            },
        });

        console.log('Client created successfully:', result.id);
        return result;

    } catch (error) {
        console.error('Error creating client:', error);
        
        if (error instanceof ConflictException) {
            throw error;
        }

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            throw new ConflictException('A client with this email already exists');
        }

        if (error.message.includes('Numeric overflow')) {
            throw new ConflictException('Contract number is too large');
        }

        // Log the full error for debugging
        console.error('Detailed error:', JSON.stringify(error, null, 2));
        throw new Error('Failed to create client. Please try again.');
    }
  }
  

  async findAll() {
    const clients = await this.prisma.client.findMany({
        include: {
            organization: true,
        },
    });

    // Convert BigInt to string for serialization
    return clients.map(client => ({
      ...client,
      contractNumber: client.contractNumber.toString()
    }));
  }
  

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        organization: true,
        location : {
          include : {
            assignedGuard : {
              where : {
                deploymentTill : null,
              },
              select : {
                deploymentDate : true,
                deploymentTill : true,
                guardCategory : {
                  select :{
                    categoryName : true  
                  }
                },
                guard : {}
              }
            }
          }
        },
      },
    });

    if (!client) return null;

    // Convert BigInt to string for serialization
    return {
      ...client,
      contractNumber: client.contractNumber.toString()
    };
  }

  async findClientByOrganizationId(organizationId: string) {
    const clients = await this.prisma.client.findMany({
      where: { organizationId : organizationId },
      include: {
        organization: true,
        location : true
      },
    });

    // Convert BigInt to string for serialization
    return clients.map(client => ({
      ...client,
      contractNumber: client.contractNumber.toString()
    }));
  }
  

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const { contractNumber, ...restData } = updateClientDto;
      
      let parsedContractNumber: number | undefined;
      if (contractNumber) {
        if (!/^\d+$/.test(contractNumber)) {
          throw new ConflictException('Contract number must contain only digits');
        }
        parsedContractNumber = Number(contractNumber);
        if (isNaN(parsedContractNumber)) {
          throw new ConflictException('Contract number is not a valid number');
        }
      }

      return await this.prisma.client.update({
        where: { id },
        data: {
          ...restData,
          ...(parsedContractNumber !== undefined ? { contractNumber: parsedContractNumber } : {})
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      handlePrismaError(error);
    }
  }
  

  async remove(id: string) {
    try {
        const isExist  = await this.prisma.client.findFirst({ where: { id } });
        if(!isExist){
            throw new NotFoundException("client doesn't exist");
        }
        return this.prisma.client.delete({ where: { id } });
    } catch (error) {
        handlePrismaError(error)
    }
  }
}

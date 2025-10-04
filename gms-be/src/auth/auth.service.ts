import { 
  Injectable, 
  Logger, 
  NotFoundException, 
  UnauthorizedException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

import { JwtPayload, AuthResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  /**
   * Generates a JWT payload for a user
   */
  private async generateTokenPayload(userId: string): Promise<JwtPayload> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
            include: { role: true }
          },
          userOffice: {
            include: {
              organization: {
                include: { features: true }
              }
            }
          }
        }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      this.logger.log(`[LOGIN DEBUG] User ID: ${user.id}`);
      const role = user.userRoles[0]?.role.roleName || 'user';
      this.logger.log(`[LOGIN DEBUG] Role: ${role}`);
      const isSuperAdmin = role === 'superAdmin';
      let organizationId: string | undefined = undefined;
      let features: string[] = [];

      if (isSuperAdmin) {
        const { ALL_FEATURES } = await import('../common/constants/features');
        features = ALL_FEATURES;
        this.logger.log(`[LOGIN DEBUG] Superadmin ${user.email} granted all features: ${JSON.stringify(features)}`);
      } else {
        try {
          // Fetch organization by userId for org admins
          const org = await this.prisma.organization.findFirst({
            where: { userId: user.id },
            include: { features: true }
          });
          organizationId = org?.id;
          this.logger.log(`[LOGIN DEBUG] Queried org for userId ${user.id}: ${JSON.stringify(org)}`);
          features = org?.features?.map(f => f.feature) || [];
          this.logger.log(`[LOGIN DEBUG] Extracted features array: ${JSON.stringify(features)}`);
          if (!org) {
            this.logger.warn(`[LOGIN DEBUG] Organization not found for userId ${user.id}`);
          }
        } catch (err) {
          this.logger.error(`[LOGIN DEBUG] Prisma org feature query failed for userId ${user.id}:`, err);
          features = [];
        }
      }

      this.logger.log(`[LOGIN DEBUG] Returning features: ${JSON.stringify(features)}`);
      return {
        sub: user.id,
        email: user.email,
        role,
        organizationId,
        features,
        isSuperAdmin
      };
    } catch (error) {
      this.logger.error(
        `Error generating token payload for user ${userId}:`,
        error
      );
      throw new InternalServerErrorException('Error generating auth token');
    }
  }

  /**
   * USER SIGNUP
   */
  async signup(dto: CreateUserDto): Promise<AuthResponse> {
    try {
      this.logger.log(`Processing signup for email: ${dto.email}`);

      const user = await this.userService.create(dto);
      const payload = await this.generateTokenPayload(user.id);
      const token = this.jwtService.sign(payload);

      this.logger.log(`Signup successful for user: ${user.email}`);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          userName: user.userName,
          role: payload.role,
          organizationId: payload.organizationId,
          features: payload.features,
          isSuperAdmin: payload.isSuperAdmin
        }
      };
    } catch (error) {
      this.logger.error(`Signup failed:`, error);
      throw error;
    }
  }

  /**
   * USER LOGIN
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
        include: {
          userRoles: {
            include: { role: true }
          },
          userOffice: {
            include: {
              organization: {
                include: { features: true }
              }
            }
          }
        }
      });

      if (!user) {
        this.logger.warn(`Login failed: User not found for email ${dto.email}`);
        throw new NotFoundException('User not found');
      }

      const validPassword = await bcrypt.compare(dto.password, user.password);
      if (!validPassword) {
        this.logger.warn(`Login failed: Invalid password for email ${dto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      let features: string[] | undefined = undefined;
      let role: string | undefined = undefined;
      let isSuperAdmin: boolean = false;
      let organizationId: string | undefined = undefined;
      try {
        role = user.userRoles[0]?.role.roleName || 'user';
        isSuperAdmin = role === 'superAdmin';
      } catch (err) {
        this.logger.error(`Role resolution failed for user ${user.email}:`, err);
        return {
          token: '',
          user: {
            id: user.id,
            email: user.email,
            userName: user.userName,
            role: undefined,
            organizationId: undefined,
            features: [],
            isSuperAdmin: false
          }
        };
      }

      if (!isSuperAdmin) {
        try {
          const organization = user.userOffice[0]?.organization;
          organizationId = organization?.id;
          if (!organization) {
            this.logger.warn(`No organization found for user ${user.email}`);
            features = [];
          } else {
            try {
              features = organization.features?.map(f => f.feature).filter(Boolean) || [];
            } catch (featureErr) {
              this.logger.error(`Feature fetch failed for org ${organizationId}:`, featureErr);
              features = [];
            }
          }
        } catch (orgErr) {
          this.logger.error(`Organization lookup failed for user ${user.email}:`, orgErr);
          features = [];
        }
      }

      const payload = await this.generateTokenPayload(user.id);
      const token = this.jwtService.sign(payload);

      this.logger.log(`Login successful for user: ${user.email}`);

      // Response construction
      const response: AuthResponse = {
        token,
        user: {
          id: user.id,
          email: user.email,
          userName: user.userName,
          role: payload.role,
          organizationId: payload.organizationId,
          isSuperAdmin: payload.isSuperAdmin,
          features: Array.isArray(payload.features) ? payload.features : []
        }
      };
      return response;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login failed for email ${dto.email}:`, error);
      throw new InternalServerErrorException('Login failed');
    }
  }
}

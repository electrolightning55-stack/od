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

      const role = user.userRoles[0]?.role.roleName || 'user';
      const isSuperAdmin = role === 'superAdmin';
      const organization = user.userOffice[0]?.organization;
      const organizationId = isSuperAdmin ? undefined : organization?.id;

      let features: string[] = [];

      if (isSuperAdmin) {
        const { ALL_FEATURES } = await import('../common/constants/features');
        features = ALL_FEATURES;
        this.logger.log(`Superadmin ${user.email} granted all features`);
      } else if (organization) {
        features = organization.features.map(f => f.feature).filter(Boolean);

        if (features.length === 0) {
          this.logger.warn(
            `User ${user.email} organization ${organizationId} has no features`
          );
        }
      } else {
        this.logger.warn(
          `Non-superadmin user ${user.email} has no organization`
        );
      }

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

      const payload = await this.generateTokenPayload(user.id);
      const token = this.jwtService.sign(payload);

      this.logger.log(`Login successful for user: ${user.email}`);

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
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login failed for email ${dto.email}:`, error);
      throw new InternalServerErrorException('Login failed');
    }
  }
}

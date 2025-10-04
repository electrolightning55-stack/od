import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

// Define expected JWT payload shape
interface JwtPayload {
  sub: string;         // User ID
  email: string;       // User email
  organizationId?: string;  // Organization ID (optional because superAdmin might not have one)
  features?: string[]; // Organization features
  role?: string;       // User role
  iat?: number;        // Issued at
  exp?: number;        // Expiration
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET must be defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // Now properly typed as string
    });
  }

  /**
   * Validate and enrich the JWT payload
   * This method is called by Passport.js after token is verified
   */
  async validate(payload: JwtPayload) {
    try {
      this.logger.debug(`Validating JWT payload for user: ${payload.email}`);

      // 1. Basic payload validation
      if (!payload.sub || !payload.email) {
        this.logger.error('JWT payload missing required fields', payload);
        throw new UnauthorizedException('Invalid token format');
      }

      // 2. Fetch latest user data from database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          userOffice: {
            include: {
              organization: {
                include: {
                  features: true
                }
              }
            }
          },
          userRoles: {
            include: {
              role: true
            }
          }
        }
      });

      if (!user) {
        this.logger.error(`User not found for sub: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }

      // 3. Get organization info (if not superadmin)
      const organization = user.userOffice?.[0]?.organization;
      const organizationId = organization?.id;
      const features = organization?.features?.map(f => f.feature) || [];

      // 4. Check role (superadmin doesn't need organizationId)
      const isSuperAdmin = user.userRoles.some(ur => ur.role.roleName === 'superAdmin');
      
      if (!isSuperAdmin && !organizationId) {
        this.logger.warn(`Non-superadmin user ${user.id} has no organization`);
        throw new UnauthorizedException('User has no organization access');
      }

      // 5. If no features found for organization user, log warning
      if (!isSuperAdmin && organizationId && features.length === 0) {
        this.logger.warn(
          `User ${user.id} organization ${organizationId} has no features`
        );
      }

      // 6. Return enriched user object
      // This becomes available as req.user in your controllers/decorators
      return {
        id: user.id,
        email: user.email,
        organizationId,  // Will be undefined for superadmin
        features,        // Empty array if no features
        isSuperAdmin,
        role: user.userRoles[0]?.role.roleName || 'user',
        // Add any other needed user fields
      };

    } catch (error) {
      // Log unexpected errors but don't expose internals
      if (!(error instanceof UnauthorizedException)) {
        this.logger.error('Error validating JWT:', error);
        throw new UnauthorizedException('Authentication failed');
      }
      throw error;
    }
  }
}
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET_KEY')!,
    });
  }

  async validate(payload: any) {
    // Attach user info to request
    return {
      userId: payload.userId,
      email: payload.email,
      roleName: payload.roleName,
      organizationId: payload.organizationId || null,
    };
  }
}

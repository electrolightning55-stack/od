import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  token!: string;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string' },
      userName: { type: 'string' },
      role: { type: 'string', nullable: true },
      organizationId: { type: 'string', nullable: true },
      features: { type: 'array', items: { type: 'string' }, nullable: true },
      isSuperAdmin: { type: 'boolean', nullable: true }
    }
  })
  user!: {
    id: string;
    email: string;
    userName: string;
    role?: string;
    organizationId?: string;
    features?: string[];
    isSuperAdmin?: boolean;
  };
}
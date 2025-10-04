export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  organizationId?: string;
  features: string[];
  isSuperAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    userName: string;
    role?: string;
    organizationId?: string;
    features?: string[];
    isSuperAdmin?: boolean;
  };
}
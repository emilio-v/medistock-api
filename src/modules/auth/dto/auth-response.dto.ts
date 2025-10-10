import { UserRole, UserStatus } from 'src/common/constants/roles.enum';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
}

export class OrganizationResponseDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phone?: string;
  subscriptionStatus: string;
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export class AuthResponseDto {
  user: UserResponseDto;
  organization: OrganizationResponseDto;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

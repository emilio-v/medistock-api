import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { Organization } from 'src/database/entities/organization.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get tenant slug from header
    const tenantSlug = request.headers['x-tenant-slug'] as string;

    if (!tenantSlug) {
      throw new BadRequestException('x-tenant-slug header is required');
    }

    // Verify tenant exists and is active
    const organization = await this.organizationRepository.findOne({
      where: { slug: tenantSlug, isActive: true },
    });

    if (!organization) {
      throw new ForbiddenException('Organization not found or inactive');
    }

    // Verify user belongs to this organization
    if (user.organizationId !== organization.id) {
      throw new ForbiddenException(
        'User does not have access to this organization',
      );
    }

    // Attach organization to request for use in controllers/services
    request.organization = organization;

    return true;
  }
}

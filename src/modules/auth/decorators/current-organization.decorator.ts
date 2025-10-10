import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { Organization } from 'src/database/entities/organization.entity';

export const CurrentOrganization = createParamDecorator(
  (data: keyof Organization | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const organization: Organization | undefined = request.organization;

    return data ? organization?.[data] : organization;
  },
);

import { Request } from 'express';
import { Organization } from 'src/database/entities/organization.entity';
import { User } from 'src/database/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
  organization?: Organization;
}

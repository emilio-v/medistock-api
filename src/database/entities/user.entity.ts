import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { UserRole, UserStatus } from '../../common/constants/roles.enum';
import { TenantBaseEntity } from './base.entity';
import { Organization } from './organization.entity';

@Entity('users')
export class User extends TenantBaseEntity {
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 255, unique: true })
  @Index()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt?: Date;

  @Column({ type: 'json', nullable: true })
  preferences?: Record<string, any>;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.users)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  // Computed properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  get isAdmin(): boolean {
    return [UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.ADMIN].includes(
      this.role,
    );
  }
}

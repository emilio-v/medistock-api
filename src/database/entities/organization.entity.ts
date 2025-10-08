import { Column, Entity, Index, OneToMany } from 'typeorm';

import { SubscriptionStatus } from '../../common/constants/roles.enum';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 100, unique: true })
  @Index()
  slug: string;

  @Column({ length: 500, nullable: true })
  description?: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column({ length: 10, nullable: true })
  taxId?: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIAL,
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'trial_ends_at' })
  trialEndsAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'subscription_ends_at' })
  subscriptionEndsAt?: Date;

  @Column({ type: 'json', nullable: true })
  settings?: Record<string, any>;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // Relations
  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}

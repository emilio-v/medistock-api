import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * Base entity with common fields for all entities
 * Includes soft delete functionality and audit timestamps
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @VersionColumn({ default: 0 })
  version: number;
}

/**
 * Base entity for tenant-scoped entities
 * All tenant data must extend this class for proper multi-tenant isolation
 */
export abstract class TenantBaseEntity extends BaseEntity {
  @Column('uuid', { name: 'organization_id' })
  @Index() // Critical for performance - all tenant queries filter by this
  organizationId: string;
}

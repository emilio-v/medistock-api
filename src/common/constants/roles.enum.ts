export enum UserRole {
  SUPER_ADMIN = 'super-admin', // Cross-tenant admin (system level)
  OWNER = 'owner', // Organization owner
  ADMIN = 'admin', // Organization admin
  MANAGER = 'manager', // Branch manager
  MEMBER = 'member', // Regular employee
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
}

export enum SaleStatus {
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

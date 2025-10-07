export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
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

import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Lifecycle status of a subscription. */
export enum SubscriptionStatus {
  Active = 'ACTIVE',
  PastDue = 'PAST_DUE',
  Cancelled = 'CANCELLED'
}

/** Subscription aggregate root (user story US16). */
export class Subscription implements BaseEntity {
  id: number | string;
  companyId: number | string;
  planId: number | string;
  status: SubscriptionStatus;
  startedAt: Date;
  renewsAt: Date | null;

  constructor(subscription: {
    id?: number | string;
    companyId?: number | string;
    planId?: number | string;
    status?: SubscriptionStatus;
    startedAt?: Date;
    renewsAt?: Date | null;
  }) {
    this.id = subscription.id ?? 0;
    this.companyId = subscription.companyId ?? 0;
    this.planId = subscription.planId ?? 0;
    this.status = subscription.status ?? SubscriptionStatus.Active;
    this.startedAt = subscription.startedAt ?? new Date();
    this.renewsAt = subscription.renewsAt ?? null;
  }
}

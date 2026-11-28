import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import {
  OrganizationSubscriptionResponse,
  ResourceUsageResponse,
  SubscriptionUsageResponse,
  SubscriptionsApiEndpoint
} from '../infrastructure/subscriptions-api.endpoint';

/** A resource whose current usage does not fit in a plan. */
export interface DowngradeBlocker {
  resource: string;
  used: number;
  limit: number;
}

/** Application state management for the Subscription Management bounded context. */
@Injectable({ providedIn: 'root' })
export class SubscriptionStore {
  private readonly subscriptionsApi = inject(SubscriptionsApiEndpoint);

  private readonly plansSignal = signal<SubscriptionPlan[]>([]);
  private readonly subscriptionsSignal = signal<OrganizationSubscriptionResponse[]>([]);
  private readonly usageSignal = signal<SubscriptionUsageResponse | null>(null);
  private readonly usageLoadedSignal = signal(false);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly plans = this.plansSignal.asReadonly();
  /** Subscriptions registered by the signed-in organization (GET /api/v1/subscriptions). */
  readonly subscriptions = this.subscriptionsSignal.asReadonly();
  /** Active subscription with its usage; null when the organization has none. */
  readonly usage = this.usageSignal.asReadonly();
  readonly usageLoaded = this.usageLoadedSignal.asReadonly();
  readonly hasActiveSubscription = computed(() => this.usageSignal() !== null);
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Loads the plan catalog from the backend (GET /api/v1/subscription-plans). */
  loadPlans(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.subscriptionsApi.getPlans().subscribe({
      next: (plans) => {
        this.plansSignal.set(plans);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        this.errorSignal.set(error.message);
        this.loadingSignal.set(false);
      }
    });
  }

  loadSubscriptions(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.subscriptionsApi.getAll().subscribe({
      next: (subscriptions) => {
        this.subscriptionsSignal.set(subscriptions);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        this.errorSignal.set(error.message);
        this.loadingSignal.set(false);
      }
    });
  }

  /** Loads the active subscription and the usage of warehouses, sensors and users. */
  loadUsage(): void {
    this.subscriptionsApi.getCurrentUsage().subscribe({
      next: (usage) => {
        this.usageSignal.set(usage);
        this.usageLoadedSignal.set(true);
      },
      error: (error: Error) => {
        this.errorSignal.set(error.message);
        this.usageLoadedSignal.set(true);
      }
    });
  }

  /** Activates the selected plan for the organization (POST /api/v1/subscriptions). */
  subscribe(plan: SubscriptionPlan): Observable<OrganizationSubscriptionResponse> {
    return this.subscriptionsApi.activate(plan.id).pipe(
      tap((created) => {
        this.subscriptionsSignal.update((current) => [...current, created]);
        this.loadUsage();
      })
    );
  }

  /** Changes the plan of the active subscription. The backend validates the usage again. */
  changePlan(plan: SubscriptionPlan): Observable<OrganizationSubscriptionResponse> {
    const subscriptionId = this.usageSignal()?.subscriptionId;
    if (!subscriptionId) {
      return this.subscribe(plan);
    }
    return this.subscriptionsApi.changePlan(subscriptionId, plan.id).pipe(tap(() => this.loadUsage()));
  }

  /**
   * Resources that would not fit in the given plan with the current usage. A plan change is only
   * allowed when this list is empty; nothing is ever deleted to make a plan fit.
   */
  downgradeBlockers(plan: SubscriptionPlan): DowngradeBlocker[] {
    const usage = this.usageSignal();
    if (!usage) {
      return [];
    }
    return usage.resources
      .map((item) => ({ resource: item.resource, used: item.used, limit: this.limitOf(plan, item) }))
      .filter((item) => item.used > item.limit);
  }

  private limitOf(plan: SubscriptionPlan, item: ResourceUsageResponse): number {
    switch (item.resource) {
      case 'warehouses':
        return plan.warehouseLimit;
      case 'sensorNodes':
        return plan.sensorNodeLimit;
      default:
        return plan.userLimit;
    }
  }
}

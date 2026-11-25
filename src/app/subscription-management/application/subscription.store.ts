import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SUBSCRIPTION_PLAN_CATALOG } from '../domain/model/subscription-plan-catalog';
import {
  OrganizationSubscriptionResponse,
  SubscriptionsApiEndpoint
} from '../infrastructure/subscriptions-api.endpoint';

/** Application state management for the Subscription Management bounded context. */
@Injectable({ providedIn: 'root' })
export class SubscriptionStore {
  private readonly subscriptionsApi = inject(SubscriptionsApiEndpoint);

  private readonly plansSignal = signal<SubscriptionPlan[]>([]);
  private readonly subscriptionsSignal = signal<OrganizationSubscriptionResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly plans = this.plansSignal.asReadonly();
  /** Subscriptions registered by the signed-in organization (GET /api/v1/subscriptions). */
  readonly subscriptions = this.subscriptionsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** The plan catalog is local: the backend exposes no plan endpoint. */
  loadPlans(): void {
    this.errorSignal.set(null);
    this.plansSignal.set([...SUBSCRIPTION_PLAN_CATALOG]);
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

  /** Registers the chosen plan for the organization (POST /api/v1/subscriptions). */
  subscribe(plan: SubscriptionPlan): Observable<OrganizationSubscriptionResponse> {
    return this.subscriptionsApi.create({
      planName: plan.name,
      price: plan.monthlyPrice.amount,
      maxWarehouses: plan.warehouseLimit,
      maxSensors: plan.sensorNodeLimit,
      status: 'ACTIVE'
    }).pipe(
      tap((created) => this.subscriptionsSignal.update((current) => [...current, created]))
    );
  }
}

import { Injectable, inject, signal } from '@angular/core';

import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SubscriptionPlansApiEndpoint } from '../infrastructure/subscription-plans-api.endpoint';

/** Application state management for the Subscription Management bounded context. */
@Injectable({ providedIn: 'root' })
export class SubscriptionStore {
  private readonly subscriptionPlansApi = inject(SubscriptionPlansApiEndpoint);

  private readonly plansSignal = signal<SubscriptionPlan[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly plans = this.plansSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  loadPlans(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.subscriptionPlansApi.getAll().subscribe({
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
}

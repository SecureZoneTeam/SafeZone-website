import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { SubscriptionStore } from '../../../application/subscription.store';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { ResourceUsageResponse } from '../../../infrastructure/subscriptions-api.endpoint';

/**
 * Settings > Subscription: current plan, price, dates, status, usage of each limited resource
 * and the plan change. Downgrades that do not fit the current usage are blocked (the backend
 * checks again); nothing is ever deleted to make a plan fit.
 */
@Component({
  selector: 'app-subscription-settings',
  imports: [MatProgressBarModule, TranslatePipe, DatePipe, RouterLink],
  templateUrl: './subscription-settings.html',
  styleUrl: './subscription-settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionSettings implements OnInit {
  private readonly router = inject(Router);
  protected readonly subscriptionStore = inject(SubscriptionStore);
  protected readonly expandedPlan = signal<string | null>(null);

  ngOnInit(): void {
    this.subscriptionStore.loadPlans();
    this.subscriptionStore.loadUsage();
  }

  protected resourceKey(resource: string): string {
    return `subscriptions.limits.resources.${resource}`;
  }

  /** Percentage of the limit in use (0-100) for the progress bar. */
  protected percent(item: ResourceUsageResponse): number {
    return item.limit ? Math.min(100, Math.round((item.used / item.limit) * 100)) : 0;
  }

  protected isCurrent(plan: SubscriptionPlan): boolean {
    return this.subscriptionStore.usage()?.planCode === plan.code;
  }

  protected planNameKey(plan: SubscriptionPlan): string {
    const known = ['BASIC', 'PREMIUM', 'CORPORATE'];
    return known.includes(plan.code) ? `subscriptions.plans.${plan.code.toLowerCase()}` : plan.name;
  }

  protected toggleBlockers(plan: SubscriptionPlan): void {
    this.expandedPlan.update((current) => (current === plan.code ? null : plan.code));
  }

  /** Opens the confirmation page; the change itself is confirmed there. */
  protected choose(plan: SubscriptionPlan): void {
    void this.router.navigate(['/subscription/checkout'], { queryParams: { plan: plan.code } });
  }
}

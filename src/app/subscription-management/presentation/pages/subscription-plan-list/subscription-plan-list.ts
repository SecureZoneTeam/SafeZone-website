import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { SubscriptionStore } from '../../../application/subscription.store';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';

/** Plan catalog loaded from GET /api/v1/subscription-plans; the first step after an owner signs up. */
@Component({
  selector: 'app-subscription-plan-list',
  imports: [MatProgressBarModule, TranslatePipe, RouterLink],
  templateUrl: './subscription-plan-list.html',
  styleUrl: './subscription-plan-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionPlanList implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly subscriptionStore = inject(SubscriptionStore);
  protected readonly selectedPlanCode = signal<string | null>(null);

  ngOnInit(): void {
    this.selectedPlanCode.set(this.route.snapshot.queryParamMap.get('plan'));
    this.subscriptionStore.loadPlans();
    this.subscriptionStore.loadUsage();
  }

  /** Translation key of a plan name (BASIC / PREMIUM / CORPORATE); other plans keep their API name. */
  protected planNameKey(plan: SubscriptionPlan): string {
    const known = ['BASIC', 'PREMIUM', 'CORPORATE'];
    return known.includes(plan.code) ? `subscriptions.plans.${plan.code.toLowerCase()}` : plan.name;
  }

  protected isCurrent(plan: SubscriptionPlan): boolean {
    return this.subscriptionStore.usage()?.planCode === plan.code;
  }

  protected selectPlan(planCode: string): void {
    void this.router.navigate(['/subscription/checkout'], { queryParams: { plan: planCode } });
  }
}

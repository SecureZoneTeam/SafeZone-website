import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { SubscriptionStore } from '../../../application/subscription.store';

/**
 * Subscription plan comparison view (user stories US15 and US16).
 * Reads the `plan` query parameter sent by the Landing Page pricing call-to-action,
 * so the experience stays consistent between both products.
 */
@Component({
  selector: 'app-subscription-plan-list',
  imports: [MatProgressBarModule, TranslatePipe],
  templateUrl: './subscription-plan-list.html',
  styleUrl: './subscription-plan-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionPlanList implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly subscriptionStore = inject(SubscriptionStore);
  protected readonly selectedPlanCode = signal<string | null>(null);

  ngOnInit(): void {
    this.selectedPlanCode.set(this.route.snapshot.queryParamMap.get('plan'));
    this.subscriptionStore.loadPlans();
  }
}

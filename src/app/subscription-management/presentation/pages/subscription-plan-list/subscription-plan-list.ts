import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { SubscriptionStore } from '../../../application/subscription.store';

@Component({
  selector: 'app-subscription-plan-list',
  imports: [MatProgressBarModule, TranslatePipe],
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
  }

  protected selectPlan(planCode: string): void {
    void this.router.navigate(
      ['/subscription/checkout'],
      {
        queryParams: {
          plan: planCode
        }
      }
    );
  }
}

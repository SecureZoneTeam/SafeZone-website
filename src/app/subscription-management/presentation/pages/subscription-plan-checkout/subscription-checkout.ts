import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { SubscriptionStore } from '../../../application/subscription.store';

@Component({
  selector: 'app-subscription-checkout',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './subscription-checkout.html',
  styleUrl: './subscription-checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionCheckout implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly subscriptionStore = inject(SubscriptionStore);

  protected readonly selectedPlanCode =
    signal<string | null>(null);

  ngOnInit(): void {

    this.selectedPlanCode.set(
      this.route.snapshot.queryParamMap.get('plan')
    );

    this.subscriptionStore.loadPlans();
  }

  protected get selectedPlan() {

    const code = this.selectedPlanCode();

    return this.subscriptionStore
      .plans()
      .find(plan => plan.code === code);
  }

  protected goBack(): void {

    void this.router.navigate(['/subscription']);
  }

  protected confirmPayment(): void {

    alert('Payment confirmed successfully.');
  }
}

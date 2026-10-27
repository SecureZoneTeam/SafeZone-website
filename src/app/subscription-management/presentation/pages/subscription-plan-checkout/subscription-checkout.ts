import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageService } from '../../../../shared/infrastructure/language.service';

import { SubscriptionStore } from '../../../application/subscription.store';

@Component({
  selector: 'app-subscription-checkout',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './subscription-checkout.html',
  styleUrl: './subscription-checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionCheckout implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);

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

  /** Translation key of a plan name (BASIC / PREMIUM / CORPORATE); other plans keep their API name. */
  protected planNameKey(plan: { code: string; name: string }): string {
    const known = ['BASIC', 'PREMIUM', 'CORPORATE'];
    return known.includes(plan.code) ? `subscriptions.plans.${plan.code.toLowerCase()}` : plan.name;
  }

  protected goBack(): void {

    void this.router.navigate(['/subscription']);
  }

  protected confirmPayment(): void {

    alert(this.language.instant('subscriptions.checkout.confirmed'));
  }
}

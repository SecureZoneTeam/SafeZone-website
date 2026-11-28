import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageService } from '../../../../shared/infrastructure/language.service';
import { SubscriptionStore } from '../../../application/subscription.store';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { LimitViolation, SubscriptionApiError } from '../../../infrastructure/subscriptions-api.endpoint';

/**
 * Confirms the activation or change of a plan. No payment gateway is integrated: the backend
 * activates the plan and issues an invoice (status ISSUED) that is paid outside the platform.
 */
@Component({
  selector: 'app-subscription-checkout',
  imports: [TranslatePipe],
  templateUrl: './subscription-checkout.html',
  styleUrl: './subscription-checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionCheckout implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly subscriptionStore = inject(SubscriptionStore);
  protected readonly selectedPlanCode = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly violations = signal<LimitViolation[]>([]);

  protected readonly selectedPlan = computed(() =>
    this.subscriptionStore.plans().find((plan) => plan.code === this.selectedPlanCode()));

  /** Resources that would not fit in the selected plan with the current usage. */
  protected readonly blockers = computed(() => {
    const plan = this.selectedPlan();
    return plan ? this.subscriptionStore.downgradeBlockers(plan) : [];
  });

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

  protected resourceKey(resource: string): string {
    return `subscriptions.limits.resources.${resource}`;
  }

  protected goBack(): void {
    void this.router.navigate(['/subscription']);
  }

  /** Activates the plan, or changes the active one. The backend validates the usage again. */
  protected confirm(): void {
    const plan = this.selectedPlan();
    if (!plan || this.blockers().length > 0 || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.violations.set([]);

    this.subscriptionStore.changePlan(plan).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open(this.language.instant('subscriptions.checkout.activated'), undefined, { duration: 5000 });
        void this.router.navigate(['/settings'], { queryParams: { section: 'subscription' } });
      },
      error: (error: Error) => {
        this.submitting.set(false);
        this.errorMessage.set(error.message);
        if (error instanceof SubscriptionApiError) {
          this.violations.set(error.violations);
        }
      }
    });
  }
}

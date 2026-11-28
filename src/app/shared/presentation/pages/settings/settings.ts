import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';
import { Permissions } from '../../../../iam/domain/model/permission';
import { ProfileSettings } from '../../../../iam/presentation/components/profile-settings/profile-settings';
import { SubscriptionSettings } from '../../../../subscription-management/presentation/components/subscription-settings/subscription-settings';

type SettingsSection = 'profile' | 'subscription';

/** Settings: the profile of the signed-in user and, for the owner, the subscription of the organization. */
@Component({
  selector: 'app-settings',
  imports: [TranslatePipe, ProfileSettings, SubscriptionSettings],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Settings {
  private readonly router = inject(Router);
  protected readonly iamStore = inject(IamStore);

  /** Query parameter ?section=subscription (bound by withComponentInputBinding). */
  readonly section = input<string | undefined>();

  protected current(): SettingsSection {
    return this.section() === 'subscription' && this.canSeeSubscription() ? 'subscription' : 'profile';
  }

  protected canSeeSubscription(): boolean {
    return this.iamStore.hasPermission(Permissions.SubscriptionsView);
  }

  protected open(section: SettingsSection): void {
    void this.router.navigate([], { queryParams: { section }, queryParamsHandling: 'merge' });
  }
}

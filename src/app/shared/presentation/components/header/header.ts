import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { IamStore } from '../../../../iam/application/iam.store';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslatePipe, LanguageSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  protected readonly iamStore = inject(IamStore);
  protected readonly landingPageUrl = environment.landingPageUrl;

  protected readonly options = [
    { path: '/warehouses', labelKey: 'nav.warehouses', icon: 'warehouse' },
    { path: '/devices', labelKey: 'nav.devices', icon: 'sensors' },
    { path: '/alerts', labelKey: 'nav.alerts', icon: 'notification_important' },
    { path: '/traceability', labelKey: 'nav.traceability', icon: 'history' },
    { path: '/subscription', labelKey: 'nav.subscription', icon: 'credit_card' }
  ];

  protected signOut(): void {
    this.iamStore.signOut();
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LanguageSwitcher } from '../language-switcher/language-switcher';

import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-layout',

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LanguageSwitcher,
    TranslatePipe
  ],

  templateUrl: './layout.html',
  styleUrl: './layout.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {

  private readonly iamStore = inject(IamStore);

  signOut(): void {
    this.iamStore.signOut();
  }
}

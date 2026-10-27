import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { LanguageSwitcher } from '../language-switcher/language-switcher';

import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-layout',

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LanguageSwitcher,
    TranslatePipe,
    NgOptimizedImage
  ],

  templateUrl: './layout.html',
  styleUrl: './layout.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {

  protected readonly iamStore = inject(IamStore);

  /** Initials of the signed-in user for the sidebar avatar (e.g. "fperez" -> "FP"). */
  protected readonly userInitials = computed(() => {
    const username = this.iamStore.currentUser()?.username ?? '';
    const parts = username.split(/[\s._-]+/).filter(Boolean);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : username.slice(0, 2);
    return (initials || 'NS').toUpperCase();
  });

  signOut(): void {
    this.iamStore.signOut();
  }
}

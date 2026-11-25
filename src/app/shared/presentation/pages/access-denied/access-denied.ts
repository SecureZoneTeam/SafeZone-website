import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';

/** Shown when a user opens a screen its permissions do not allow (also by typing the URL). */
@Component({
  selector: 'app-access-denied',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessDenied {
  protected readonly iamStore = inject(IamStore);
}

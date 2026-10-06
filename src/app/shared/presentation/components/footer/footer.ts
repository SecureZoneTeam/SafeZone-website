import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { environment } from '../../../../../environments/environment';

/**
 * Global footer, visually aligned with the NodeSecure Landing Page footer.
 * Includes the Terms and Conditions link required by the ethics and responsibility criterion.
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();
  protected readonly landingPageUrl = environment.landingPageUrl;
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Layout } from './shared/presentation/components/layout/layout';
import { environment } from '../environments/environment';

/** Root shell component of the NodeSecure Frontend Web Application. */
@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly translateService = inject(TranslateService);
  protected readonly title = signal('NodeSecure');

  constructor() {
    this.translateService.addLangs(environment.supportedLanguages);
    this.translateService.use(environment.defaultLanguage);
  }
}

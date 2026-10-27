import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LanguageService } from '@shared/infrastructure/language.service';

/** Root shell component of the NodeSecure Frontend Web Application. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('NodeSecure');

  constructor() {
    // Loads the saved language (or the browser / default one) from public/i18n.
    inject(LanguageService).init();
  }
}

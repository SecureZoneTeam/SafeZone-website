import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../environments/environment';
import {RouterOutlet} from "@angular/router";

/** Root shell component of the NodeSecure Frontend Web Application. */
@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly translateService = inject(TranslateService);
  protected readonly title = signal('NodeSecure');

  constructor() {
    this.translateService.addLangs(environment.supportedLanguages);
    this.translateService.setDefaultLang(environment.defaultLanguage);

    this.translateService.use(environment.defaultLanguage).subscribe({
      next: () => {
        console.log('Idioma inicial:', this.translateService.currentLang);
      },
      error: (error) => {
        console.error('Error cargando idioma:', error);
      }
    });
  }
}

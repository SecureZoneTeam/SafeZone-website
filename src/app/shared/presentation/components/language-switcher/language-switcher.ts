import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import {
  MatButtonToggle,
  MatButtonToggleGroup
} from '@angular/material/button-toggle';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcher {

  private readonly translate = inject(TranslateService);

  protected currentLanguage = 'en';

  protected readonly languages = ['en', 'es'];

  constructor() {
    this.currentLanguage =
      this.translate.currentLang || 'en';
  }

  protected useLanguage(language: string): void {

    this.translate.use(language);

    this.currentLanguage = language;

    console.log('Idioma cambiado a:', language);
  }
}

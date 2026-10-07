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
    console.log('Idioma seleccionado:', language);

    this.translate.use(language).subscribe({
      next: () => {
        this.currentLanguage = language;

        console.log('Idioma actual:', this.translate.currentLang);
        console.log(
          'Traducción:',
          this.translate.instant('warehouses.list.title')
        );
      },
      error: (error) => {
        console.error('Error loading language:', error);
      }
    });
  }
}

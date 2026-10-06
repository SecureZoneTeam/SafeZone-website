import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  private translate = inject(TranslateService);

  currentLanguage = this.translate.currentLang || 'en';

  languages = ['en', 'es'];

  useLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
  }
}

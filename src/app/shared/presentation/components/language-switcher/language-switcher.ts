import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

import {
  MatButtonToggle,
  MatButtonToggleGroup
} from '@angular/material/button-toggle';

import { LanguageService } from '../../../infrastructure/language.service';

/** EN / ES toggle. The selected language is applied to every text of the app (public/i18n). */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    TranslatePipe
  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcher {

  protected readonly language = inject(LanguageService);

  protected useLanguage(language: string): void {
    this.language.use(language);
  }
}

import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Route titles are translation keys (see app.routes.ts, "titles.*").
 * This strategy translates them and updates the browser tab when the language changes.
 */
@Injectable()
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);
  private currentKey: string | undefined;

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => this.applyTitle());
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.currentKey = this.buildTitle(snapshot);
    this.applyTitle();
  }

  private applyTitle(): void {
    const appName = 'NodeSecure';
    if (!this.currentKey) {
      this.title.setTitle(appName);
      return;
    }
    this.translate.get(this.currentKey).subscribe((text: string) => {
      this.title.setTitle(`${text} | ${appName}`);
    });
  }
}

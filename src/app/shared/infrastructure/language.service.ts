import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '@environments/environment';

const STORAGE_KEY = 'nodesecure.language';

/**
 * Central place to read and change the UI language.
 * - Loads the JSON files from public/i18n through ngx-translate.
 * - Remembers the language chosen by the user (localStorage).
 * - Updates the <html lang> attribute and exposes the locale used by the DatePipe.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly supportedLanguages = environment.supportedLanguages;

  private readonly languageSignal = signal(environment.defaultLanguage);

  /** Current language code ("en" | "es"). */
  readonly currentLanguage = this.languageSignal.asReadonly();

  /** Locale id for Angular pipes (date, number...). */
  readonly dateLocale = computed(() => (this.languageSignal() === 'es' ? 'es' : 'en-US'));

  /** Call once when the app starts. */
  init(): void {
    this.translate.addLangs(this.supportedLanguages);
    this.use(this.initialLanguage());
  }

  /** Changes the UI language and remembers it. */
  use(language: string): void {
    const next = this.supportedLanguages.includes(language) ? language : environment.defaultLanguage;
    this.languageSignal.set(next);
    this.document.documentElement.lang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage not available (private mode) */
    }
    this.translate.use(next).subscribe({
      error: (error) => console.error(`Could not load the "${next}" translations:`, error)
    });
  }

  /** Synchronous translation for TypeScript code (confirm dialogs, alerts...). */
  instant(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }

  private initialLanguage(): string {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && this.supportedLanguages.includes(saved)) return saved;
    } catch {
      /* storage not available */
    }
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    return this.supportedLanguages.includes(browser) ? browser : environment.defaultLanguage;
  }
}

import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MatIconRegistry } from '@angular/material/icon';

import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors,
  withXhr
} from '@angular/common/http';

import {
  provideAnimationsAsync
} from '@angular/platform-browser/animations/async';

import {
  provideTranslateService
} from '@ngx-translate/core';

import {
  provideTranslateHttpLoader
} from '@ngx-translate/http-loader';

import { routes } from './app.routes';

import {
  authenticationInterceptor
} from './iam/infrastructure/authentication.interceptor';

import {
  environment
} from '../environments/environment';

import { TranslatedTitleStrategy } from './shared/infrastructure/translated-title.strategy';

// Spanish month / day names for the DatePipe (e.g. "oct 26" instead of "Oct 26").
registerLocaleData(localeEs, 'es');


export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(
      routes,
      withComponentInputBinding()
    ),

    // Page titles are translation keys ("titles.*") translated on every language change.
    {
      provide: TitleStrategy,
      useClass: TranslatedTitleStrategy
    },

    // <mat-icon> uses the same font that is loaded in index.html (Material Symbols Outlined).
    provideAppInitializer(() => {
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
    }),

    provideHttpClient(
      withXhr(),
      withInterceptors([
        authenticationInterceptor
      ])
    ),

    provideAnimationsAsync(),


    provideTranslateService({

      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),

      fallbackLang:
      environment.defaultLanguage,

      lang:
      environment.defaultLanguage

    })

  ]

};

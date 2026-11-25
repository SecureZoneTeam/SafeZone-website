import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';

import { IamStore } from '../application/iam.store';

const tokenStorageKey = 'node-secure.token';

/** Placeholder issued by the offline local session; it is never sent to the API. */
const localSessionToken = 'local-development-session';

const PUBLIC_AUTH_PATHS = ['/authentication/sign-in', '/authentication/sign-up'];

/**
 * Attaches the JWT bearer token to every request and reacts to authorization errors:
 * 401 closes the session (expired, suspended or revoked) and 403 informs the user.
 * Dependencies are resolved lazily to avoid circular injection with HttpClient.
 */
export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  const injector = inject(Injector);
  const token = localStorage.getItem(tokenStorageKey);
  const isPublicAuthCall = PUBLIC_AUTH_PATHS.some((path) => request.url.endsWith(path));
  const authorized = !token || token === localSessionToken || isPublicAuthCall
    ? request
    : request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !isPublicAuthCall) {
        if (error.status === 401 && token) {
          injector.get(IamStore).clearSession();
          void injector.get(Router).navigate(['/sign-in']);
        } else if (error.status === 403) {
          injector.get(MatSnackBar).open(injector.get(TranslateService).instant('access.denied.toast'),
            undefined, { duration: 4000 });
        }
      }
      return throwError(() => error);
    })
  );
};

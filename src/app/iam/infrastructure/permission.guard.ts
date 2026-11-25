import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';

import { IamStore } from '../application/iam.store';

/**
 * Restricts a route to users holding ANY of the permission codes in {@code data.permissions}.
 * A direct URL to a forbidden screen ends in the access-denied page. This is a usability measure:
 * the API rejects the same operations with 403 regardless of the interface.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const required = (route.data['permissions'] as string[] | undefined) ?? [];
  const iamStore = inject(IamStore);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const translate = inject(TranslateService);

  return iamStore.loadSession().pipe(
    map((user) => {
      if (!user) {
        return router.createUrlTree(['/sign-in']);
      }
      if (required.length === 0 || iamStore.hasAnyPermission(required)) {
        return true;
      }
      snackBar.open(translate.instant('access.denied.toast'), undefined, { duration: 4000 });
      return router.createUrlTree(['/access-denied']);
    })
  );
};

/** Redirects the empty path to the first screen the user is allowed to open. */
export const landingGuard: CanActivateFn = () => {
  const iamStore = inject(IamStore);
  const router = inject(Router);
  return iamStore.loadSession().pipe(
    map((user) => router.parseUrl(user ? iamStore.landingPath() : '/sign-in'))
  );
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';

import { IamStore } from '../application/iam.store';

/** Restricts a route to any of the role codes supplied through route data. */
export const roleGuard: CanActivateFn = (route) => {
  const allowedRoles = route.data['roles'] as string[] | undefined;
  if (!allowedRoles?.length) {
    return true;
  }

  const iamStore = inject(IamStore);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const translate = inject(TranslateService);

  return iamStore.resolveCurrentUserContext().pipe(
    map((user) => {
      if (user?.roles?.some((role) => allowedRoles.includes(role))) {
        return true;
      }

      snackBar.open(translate.instant('inventory.errors.unauthorized'), undefined, {
        duration: 4000
      });
      return router.createUrlTree(['/inventory']);
    })
  );
};

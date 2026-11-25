import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { IamStore } from '../application/iam.store';

/** Prevents access to protected views when no valid session exists (the context is loaded from the API). */
export const authenticationGuard: CanActivateFn = () => {
  const iamStore = inject(IamStore);
  const router = inject(Router);

  if (!iamStore.isSignedIn()) {
    return router.createUrlTree(['/sign-in']);
  }

  return iamStore.loadSession().pipe(
    map((user) => (user ? true : router.createUrlTree(['/sign-in'])))
  );
};

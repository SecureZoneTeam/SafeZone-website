import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { IamStore } from '../application/iam.store';

/** Prevents access to protected views when no valid session exists. */
export const authenticationGuard: CanActivateFn = () => {
  const iamStore = inject(IamStore);
  const router = inject(Router);

  if (iamStore.isSignedIn()) {
    return true;
  }

  return router.createUrlTree(['/sign-in']);
};

import { HttpInterceptorFn } from '@angular/common/http';

const tokenStorageKey = 'node-secure.token';

/** Placeholder issued by the local session; it is never sent to the API. */
const localSessionToken = 'local-development-session';

/**
 * Attaches the JWT bearer token issued by the NodeSecure API (technical story TS18)
 * to every outgoing request.
 */
export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(tokenStorageKey);
  if (!token || token === localSessionToken) {
    return next(request);
  }

  return next(
    request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  );
};

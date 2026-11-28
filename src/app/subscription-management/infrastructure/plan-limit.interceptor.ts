import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';

/** Body of the 409 answers of the backend for plan limits (SubscriptionExceptionHandler). */
interface PlanLimitProblem {
  code?: string;
  planName?: string;
  resource?: string;
  used?: number;
  limit?: number;
}

const PLAN_CODES = ['PLAN_LIMIT_REACHED', 'SUBSCRIPTION_REQUIRED'];

/**
 * Turns the plan-limit answers of the API into a clear alert with an action to change the plan,
 * whatever screen created the resource (warehouses, IoT sensors or users). The error is still
 * propagated so the screen keeps its own error state.
 */
export const planLimitInterceptor: HttpInterceptorFn = (request, next) => {
  const injector = inject(Injector);
  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 409) {
        const problem = (error.error ?? {}) as PlanLimitProblem;
        if (problem.code && PLAN_CODES.includes(problem.code)) {
          showPlanAlert(injector, problem);
        }
      }
      return throwError(() => error);
    })
  );
};

function showPlanAlert(injector: Injector, problem: PlanLimitProblem): void {
  const translate = injector.get(TranslateService);
  const resource = translate.instant(`subscriptions.limits.resources.${problem.resource ?? 'warehouses'}`);
  const message = problem.code === 'SUBSCRIPTION_REQUIRED'
    ? translate.instant('subscriptions.limits.required', { resource })
    : translate.instant('subscriptions.limits.reached', {
      resource,
      plan: problem.planName ?? '',
      used: problem.used ?? 0,
      limit: problem.limit ?? 0
    });
  const action = translate.instant(problem.code === 'SUBSCRIPTION_REQUIRED'
    ? 'subscriptions.limits.choosePlan'
    : 'subscriptions.limits.changePlan');

  injector.get(MatSnackBar)
    .open(message, action, { duration: 12000, panelClass: 'ns-plan-limit-snackbar' })
    .onAction()
    .subscribe(() => {
      void injector.get(Router).navigate(
        problem.code === 'SUBSCRIPTION_REQUIRED' ? ['/subscription'] : ['/settings'],
        { queryParams: problem.code === 'SUBSCRIPTION_REQUIRED' ? {} : { section: 'subscription' } }
      );
    });
}

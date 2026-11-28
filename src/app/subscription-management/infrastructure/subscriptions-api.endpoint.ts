import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SubscriptionPlanAssembler } from './subscription-plan.assembler';
import { SubscriptionPlanResponse } from './subscription.response';

/** Resource returned by /api/v1/subscriptions (SubscriptionsController). */
export interface OrganizationSubscriptionResponse {
  id: number;
  companyId: number;
  planId: number | null;
  planName: string;
  price: number;
  currency: string | null;
  maxWarehouses: number;
  maxSensors: number;
  status: string;
  startedAt: string | null;
  renewsAt: string | null;
  cancelledAt: string | null;
  latestInvoiceId: number | null;
}

/** Usage of one limited resource; a null limit means not limited. */
export interface ResourceUsageResponse {
  resource: 'warehouses' | 'sensorNodes' | 'users';
  used: number;
  limit: number | null;
}

/** Resource returned by GET /api/v1/subscriptions/current/usage. */
export interface SubscriptionUsageResponse {
  subscriptionId: number;
  planCode: string | null;
  planName: string;
  price: number;
  currency: string | null;
  status: string;
  startedAt: string | null;
  renewsAt: string | null;
  resources: ResourceUsageResponse[];
}

/** Limit violation returned in a 409 answer (PLAN_LIMIT_REACHED / PLAN_USAGE_EXCEEDS_LIMITS). */
export interface LimitViolation {
  resource: string;
  used: number;
  limit: number;
}

/** Error of the subscriptions API keeping the HTTP status and the structured body of the backend. */
export class SubscriptionApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null = null,
    readonly violations: LimitViolation[] = []
  ) {
    super(message);
  }
}

/** API endpoint for the plan catalog and the subscription of the signed-in owner's organization. */
@Injectable({ providedIn: 'root' })
export class SubscriptionsApiEndpoint {
  private readonly http = inject(HttpClient);
  private readonly assembler = new SubscriptionPlanAssembler();
  private readonly endpointUrl = `${environment.serverBaseUrl}/subscriptions`;
  private readonly plansUrl = `${environment.serverBaseUrl}/subscription-plans`;

  /** Public catalog (GET /subscription-plans): names, prices and limits come only from the backend. */
  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlanResponse[]>(this.plansUrl).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getAll(): Observable<OrganizationSubscriptionResponse[]> {
    return this.http.get<OrganizationSubscriptionResponse[]>(this.endpointUrl)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  /** Usage against the active subscription; null when the organization has none (404). */
  getCurrentUsage(): Observable<SubscriptionUsageResponse | null> {
    return this.http.get<SubscriptionUsageResponse>(`${this.endpointUrl}/current/usage`).pipe(
      catchError((error: HttpErrorResponse) => (error.status === 404 ? of(null) : this.handleError(error)))
    );
  }

  /** Activates a catalog plan (POST /subscriptions). No payment is processed. */
  activate(planId: number | string): Observable<OrganizationSubscriptionResponse> {
    return this.http.post<OrganizationSubscriptionResponse>(this.endpointUrl, { planId: Number(planId) })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  /** Changes the plan of the active subscription (PATCH /subscriptions/{id}/plan). */
  changePlan(subscriptionId: number, planId: number | string): Observable<OrganizationSubscriptionResponse> {
    return this.http.patch<OrganizationSubscriptionResponse>(`${this.endpointUrl}/${subscriptionId}/plan`,
      { planId: Number(planId) })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const body = (error.error ?? {}) as { detail?: string; code?: string; violations?: LimitViolation[] };
    const message = error.status === 0
      ? 'NodeSecure API is unreachable. Verify that the services are running.'
      : body.detail ?? `NodeSecure API returned status ${error.status}.`;
    return throwError(() => new SubscriptionApiError(message, error.status, body.code ?? null, body.violations ?? []));
  }
}

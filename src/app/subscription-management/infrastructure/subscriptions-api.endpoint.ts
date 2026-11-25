import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

/** Resource returned by GET/POST /api/v1/subscriptions (SubscriptionsController). */
export interface OrganizationSubscriptionResponse {
  id: number;
  companyId: number;
  planName: string;
  price: number;
  maxWarehouses: number;
  maxSensors: number;
  status: string;
}

/** Body accepted by POST /api/v1/subscriptions. */
export interface CreateSubscriptionRequest {
  planName: string;
  price: number;
  maxWarehouses: number;
  maxSensors: number;
  status?: string;
}

/** API endpoint for the subscriptions of the signed-in owner's organization. */
@Injectable({ providedIn: 'root' })
export class SubscriptionsApiEndpoint {
  private readonly http = inject(HttpClient);
  private readonly endpointUrl = `${environment.serverBaseUrl}/subscriptions`;

  getAll(): Observable<OrganizationSubscriptionResponse[]> {
    return this.http.get<OrganizationSubscriptionResponse[]>(this.endpointUrl)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  create(request: CreateSubscriptionRequest): Observable<OrganizationSubscriptionResponse> {
    return this.http.post<OrganizationSubscriptionResponse>(this.endpointUrl, request)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.status === 0
      ? 'NodeSecure API is unreachable. Verify that the services are running.'
      : `NodeSecure API returned status ${error.status}.`;
    return throwError(() => new Error(message));
  }
}

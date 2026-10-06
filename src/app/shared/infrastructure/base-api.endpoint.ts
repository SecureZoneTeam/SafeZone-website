import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, retry, throwError, timer } from 'rxjs';

import { BaseEntity } from '../domain/model/base-entity';
import { BaseResponse } from './base-response';
import { BaseAssembler } from './base-assembler';

/**
 * Base API endpoint providing the CRUD operations every bounded context reuses.
 * Concrete endpoints only declare their resource path and their assembler.
 */
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource>
> {
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly endpointUrl: string,
    protected readonly assembler: TAssembler
  ) {}

  getAll(): Observable<TEntity[]> {
    return this.http.get<TResource[]>(this.endpointUrl).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      retry({ count: 2, delay: () => timer(500) }),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getById(id: number | string): Observable<TEntity> {
    return this.http.get<TResource>(`${this.endpointUrl}/${id}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  create(entity: TEntity): Observable<TEntity> {
    return this.http.post<TResource>(this.endpointUrl, this.assembler.toResourceFromEntity(entity)).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  update(id: number | string, entity: TEntity): Observable<TEntity> {
    return this.http
      .put<TResource>(`${this.endpointUrl}/${id}`, this.assembler.toResourceFromEntity(entity))
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.status === 0
        ? 'NodeSecure API is unreachable. Verify that the services are running.'
        : `NodeSecure API returned status ${error.status}.`;
    return throwError(() => new Error(message));
  }
}

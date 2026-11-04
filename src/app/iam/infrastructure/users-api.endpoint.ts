import {Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';

export interface TeamUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  companyId: number;
  warehouseId?: number | null;
}

@Injectable({ providedIn: 'root' })

export class UsersApiEndpoint {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.serverBaseUrl;

  getAll(): Observable<TeamUser[]> {
    return this.http.get<TeamUser[]>(`${this.baseUrl}/users`);
  }

  delete(id: number): Observable<void> {
    // Deferred until the resource API contract is finalized with the backend.
    // return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
    void id;
    return this.pendingWriteError();
  }

  create(user: Omit<TeamUser, 'id'>): Observable<TeamUser> {
    // Deferred until the resource API contract is finalized with the backend.
    // return this.http.post<TeamUser>(`${this.baseUrl}/users`, user);
    void user;
    return this.pendingWriteError();
  }

  update(id: number, user: Partial<TeamUser>): Observable<TeamUser> {
    // Deferred until the resource API contract is finalized with the backend.
    // return this.http.patch<TeamUser>(`${this.baseUrl}/users/${id}`, user);
    void id;
    void user;
    return this.pendingWriteError();
  }

  private pendingWriteError<T>(): Observable<T> {
    return throwError(() => new Error('shared.errors.resourceWritePending'));
  }
}

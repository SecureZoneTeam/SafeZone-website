import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** User of the organization as returned by GET /api/v1/users (always limited to my organization). */
export interface TeamUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  roles: string[];
  status: 'ACTIVE' | 'SUSPENDED';
  companyId: number;
  warehouseIds: number[];
  warehouseId?: number | null;
  permissionOverrides: Record<string, boolean>;
  permissions: string[];
}

/** Worker account created directly by the owner (the organization comes from the session). */
export interface CreateTeamUserRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  role: string;
  warehouseIds: number[];
}

export interface UpdateTeamUserRequest {
  email?: string;
  fullName?: string;
  role?: string;
  warehouseIds?: number[];
}

export interface PermissionDefinition {
  code: string;
  ownerOnly: boolean;
  defaultRoles: string[];
}

@Injectable({ providedIn: 'root' })
export class UsersApiEndpoint {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.serverBaseUrl;

  getAll(): Observable<TeamUser[]> {
    return this.http.get<TeamUser[]>(`${this.baseUrl}/users`);
  }

  create(user: CreateTeamUserRequest): Observable<TeamUser> {
    return this.http.post<TeamUser>(`${this.baseUrl}/users`, user);
  }

  update(id: number, user: UpdateTeamUserRequest): Observable<TeamUser> {
    return this.http.patch<TeamUser>(`${this.baseUrl}/users/${id}`, user);
  }

  updatePermissions(id: number, overrides: Record<string, boolean>): Observable<TeamUser> {
    return this.http.put<TeamUser>(`${this.baseUrl}/users/${id}/permissions`, { overrides });
  }

  suspend(id: number): Observable<TeamUser> {
    return this.http.post<TeamUser>(`${this.baseUrl}/users/${id}/suspend`, {});
  }

  reactivate(id: number): Observable<TeamUser> {
    return this.http.post<TeamUser>(`${this.baseUrl}/users/${id}/reactivate`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  getPermissionCatalog(): Observable<PermissionDefinition[]> {
    return this.http.get<PermissionDefinition[]>(`${this.baseUrl}/permissions`);
  }
}

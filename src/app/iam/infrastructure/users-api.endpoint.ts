import {Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  create(user: Omit<TeamUser, 'id'>): Observable<TeamUser> {
    return this.http.post<TeamUser>(`${this.baseUrl}/users`, user);
  }

  update(id: number, user: Partial<TeamUser>): Observable<TeamUser> {
    return this.http.patch<TeamUser>(`${this.baseUrl}/users/${id}`, user);
  }
}

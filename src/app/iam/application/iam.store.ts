import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, firstValueFrom, map, of, shareReplay, tap } from 'rxjs';

import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { AuthenticatedUser } from '../domain/model/authenticated-user';
import { ALL_PERMISSIONS, Permissions, Roles } from '../domain/model/permission';
import { AuthenticatedUserResponse } from '../infrastructure/user.response';
import { environment } from '@environments/environment';

const tokenStorageKey = 'node-secure.token';
const usernameStorageKey = 'node-secure.username';
const localSessionToken = 'local-development-session';

/** First screen of the user, in order of preference, with the permission it requires. */
const LANDING_ROUTES: ReadonlyArray<readonly [string, string]> = [
  ['/warehouses', Permissions.WarehousesView],
  ['/inventory', Permissions.InventoryView],
  ['/traceability', Permissions.TraceabilityView],
  ['/devices', Permissions.IotDevicesView],
  ['/team', Permissions.UsersView],
  ['/subscription', Permissions.SubscriptionsView]
];

/**
 * Session state. Only the token is persisted in the browser: role, permissions, warehouses and
 * organization are always loaded from the API (GET /authentication/me), so they cannot be forged
 * from the browser. The interface adapts to them, but the backend enforces every rule.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<AuthenticatedUser | null>(this.restoreSession());
  private readonly sessionLoadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);
  private pendingSession$: Observable<AuthenticatedUser | null> | null = null;

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isSignedIn = computed(() => this.currentUserSignal() !== null);
  readonly isOwner = computed(() => this.currentUserSignal()?.role === Roles.Owner);
  readonly permissions = computed(() => new Set(this.currentUserSignal()?.permissions ?? []));
  readonly openAccess = !environment.requireCredentials;

  constructor() {
    if (this.currentUserSignal()) {
      this.loadSession().subscribe();
    }
  }

  async signIn(command: SignInCommand): Promise<void> {
    this.errorSignal.set(null);

    if (this.openAccess) {
      this.startLocalSession(command.username);
      await this.router.navigateByUrl(this.landingPath());
      return;
    }

    this.loadingSignal.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthenticatedUserResponse>(`${environment.serverBaseUrl}/authentication/sign-in`, command)
      );
      this.startSession(response);
      await this.router.navigateByUrl(this.landingPath());
    } catch (error: unknown) {
      this.errorSignal.set(this.statusOf(error) === 403 ? 'iam.signIn.suspended' : 'iam.signIn.invalidCredentials');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /** Registers a new owner with its own organization and opens the session directly. */
  async signUp(command: SignUpCommand): Promise<void> {
    this.errorSignal.set(null);

    if (this.openAccess) {
      this.startLocalSession(command.username);
      await this.router.navigateByUrl(this.landingPath());
      return;
    }

    this.loadingSignal.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthenticatedUserResponse>(`${environment.serverBaseUrl}/authentication/sign-up`, {
          fullName: command.fullName,
          email: command.email,
          username: command.username,
          password: command.password,
          organizationName: command.organizationName
        })
      );
      this.startSession(response);
      await this.router.navigateByUrl(this.landingPath());
    } catch (error: unknown) {
      this.errorSignal.set(this.statusOf(error) === 409 ? 'iam.signUp.taken' : 'shared.states.error');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  signOut(): void {
    this.clearSession();
    void this.router.navigate(['/sign-in']);
  }

  /** Drops the local session without navigating (used when the API answers 401). */
  clearSession(): void {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(usernameStorageKey);
    this.pendingSession$ = null;
    this.sessionLoadedSignal.set(false);
    this.currentUserSignal.set(null);
  }

  /**
   * Loads the session context from the API once per page load and shares the result.
   * Emits null when there is no valid session.
   */
  loadSession(): Observable<AuthenticatedUser | null> {
    const currentUser = this.currentUserSignal();
    if (!currentUser) {
      return of(null);
    }
    if (this.sessionLoadedSignal() || this.openAccess) {
      return of(currentUser);
    }
    if (!this.pendingSession$) {
      this.pendingSession$ = this.http
        .get<AuthenticatedUserResponse>(`${environment.serverBaseUrl}/authentication/me`)
        .pipe(
          map((response) => this.toAuthenticatedUser(response, currentUser.token)),
          tap((user) => {
            this.currentUserSignal.set(user);
            this.sessionLoadedSignal.set(true);
          }),
          catchError(() => {
            this.clearSession();
            return of(null);
          }),
          finalize(() => (this.pendingSession$ = null)),
          shareReplay(1)
        );
    }
    return this.pendingSession$;
  }

  /** Kept for the pages that already call it: resolves the session context. */
  resolveCurrentUserContext(): Observable<AuthenticatedUser | null> {
    return this.loadSession();
  }

  hasPermission(code: string): boolean {
    return this.permissions().has(code);
  }

  hasAnyPermission(codes: readonly string[]): boolean {
    const granted = this.permissions();
    return codes.some((code) => granted.has(code));
  }

  hasRole(role: string): boolean {
    return this.currentUserSignal()?.role === role;
  }

  /** Scope check for the interface only; the API validates the warehouse again. */
  canAccessWarehouse(warehouseId: number | string | null | undefined): boolean {
    const user = this.currentUserSignal();
    if (!user || warehouseId === null || warehouseId === undefined) {
      return false;
    }
    return !!user.allWarehouses || (user.warehouseIds ?? []).includes(Number(warehouseId));
  }

  /** First assigned warehouse of a worker; null for the owner (every warehouse). */
  currentWarehouseId(): number | null {
    const user = this.currentUserSignal();
    if (!user || user.allWarehouses) {
      return null;
    }
    const first = user.warehouseIds?.[0] ?? user.warehouseId;
    return first === undefined || first === null ? null : Number(first);
  }

  currentOrganizationId(): number | null {
    const organizationId = this.currentUserSignal()?.organizationId;
    return organizationId === undefined || organizationId === null ? null : Number(organizationId);
  }

  /** First screen the user is allowed to open. */
  landingPath(): string {
    const match = LANDING_ROUTES.find(([, permission]) => this.hasPermission(permission));
    return match ? match[0] : '/access-denied';
  }

  private startSession(response: AuthenticatedUserResponse): void {
    const user = this.toAuthenticatedUser(response, response.token ?? '');
    localStorage.setItem(tokenStorageKey, user.token);
    localStorage.setItem(usernameStorageKey, user.username);
    this.currentUserSignal.set(user);
    this.sessionLoadedSignal.set(true);
  }

  private toAuthenticatedUser(response: AuthenticatedUserResponse, token: string): AuthenticatedUser {
    return {
      id: response.id,
      username: response.username,
      token,
      fullName: response.fullName,
      email: response.email,
      role: response.role ?? response.roles?.[0],
      roles: response.roles,
      permissions: response.permissions ?? [],
      allWarehouses: response.allWarehouses ?? false,
      warehouseIds: (response.warehouseIds ?? []).map(Number),
      warehouseId: response.warehouseId ?? null,
      organizationId: response.organizationId ?? null,
      organizationName: response.organizationName ?? null
    };
  }

  /** Offline development mode (environment.requireCredentials = false): purely visual, no API. */
  private startLocalSession(username: string): void {
    const user: AuthenticatedUser = {
      id: 0,
      username: username.trim() || 'demo.user',
      token: localSessionToken,
      role: Roles.Owner,
      permissions: [...ALL_PERMISSIONS],
      allWarehouses: true
    };
    localStorage.setItem(tokenStorageKey, user.token);
    localStorage.setItem(usernameStorageKey, user.username);
    this.currentUserSignal.set(user);
    this.sessionLoadedSignal.set(true);
  }

  private restoreSession(): AuthenticatedUser | null {
    const token = localStorage.getItem(tokenStorageKey);
    const username = localStorage.getItem(usernameStorageKey);
    return token && username ? { id: 0, username, token } : null;
  }

  private statusOf(error: unknown): number | null {
    return typeof error === 'object' && error !== null && 'status' in error
      ? Number((error as { status: unknown }).status)
      : null;
  }
}

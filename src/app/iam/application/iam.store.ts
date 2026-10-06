import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { AuthenticatedUser } from '../domain/model/authenticated-user';
import { AuthenticatedUserResponse } from '../infrastructure/user.response';
import { environment } from '@environments/environment';

const tokenStorageKey = 'node-secure.token';
const usernameStorageKey = 'node-secure.username';
const localSessionToken = 'local-development-session';

@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<AuthenticatedUser | null>(this.restoreSession());
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isSignedIn = computed(() => this.currentUserSignal() !== null);
  readonly openAccess = !environment.requireCredentials;

  async signIn(command: SignInCommand): Promise<void> {
    this.errorSignal.set(null);

    if (this.openAccess) {
      this.startLocalSession(command.username);
      await this.router.navigate(['/warehouses']);
      return;
    }

    this.loadingSignal.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthenticatedUserResponse>(
          `${environment.serverBaseUrl}/authentication/sign-in`,
          command
        )
      );
      this.persistSession({ id: response.id, username: response.username, token: response.token });
      await this.router.navigate(['/warehouses']);
    } catch {
      this.errorSignal.set('iam.signIn.invalidCredentials');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async signUp(command: SignUpCommand): Promise<void> {
    this.errorSignal.set(null);

    if (this.openAccess) {
      this.startLocalSession(command.username);
      await this.router.navigate(['/warehouses']);
      return;
    }

    this.loadingSignal.set(true);
    try {
      await firstValueFrom(
        this.http.post(`${environment.serverBaseUrl}/authentication/sign-up`, command)
      );
      await this.router.navigate(['/sign-in']);
    } catch {
      this.errorSignal.set('shared.states.error');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  signOut(): void {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(usernameStorageKey);
    this.currentUserSignal.set(null);
    void this.router.navigate(['/sign-in']);
  }

  private startLocalSession(username: string): void {
    this.persistSession({
      id: 0,
      username: username.trim() || 'demo.user',
      token: localSessionToken
    });
  }
  private persistSession(user: AuthenticatedUser): void {
    localStorage.setItem(tokenStorageKey, user.token);
    localStorage.setItem(usernameStorageKey, user.username);
    this.currentUserSignal.set(user);
  }

  private restoreSession(): AuthenticatedUser | null {
    const token = localStorage.getItem(tokenStorageKey);
    const username = localStorage.getItem(usernameStorageKey);
    return token && username ? { id: 0, username, token } : null;
  }
}

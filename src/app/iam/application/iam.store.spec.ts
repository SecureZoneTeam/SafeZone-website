import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';

import { IamStore } from './iam.store';
import { environment } from '@environments/environment';

const operatorSession = {
  id: 7,
  username: 'pepito',
  token: 'jwt-token',
  fullName: 'Pepito Pérez',
  role: 'ROLE_OPERATOR',
  roles: ['ROLE_OPERATOR'],
  permissions: ['dashboard.view', 'inventory.view', 'inventory.entry.create'],
  allWarehouses: false,
  warehouseIds: [1],
  warehouseId: 1,
  organizationId: 10,
  organizationName: 'Organización A'
};

describe('IamStore', () => {
  let http: HttpTestingController;

  function createStore(): IamStore {
    return TestBed.inject(IamStore);
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpTestingController);
    spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('keeps the session context returned by the API and adapts the landing screen to the permissions', async () => {
    const store = createStore();

    const signIn = store.signIn({ username: 'pepito', password: 'Secret-123' });
    http.expectOne(`${environment.serverBaseUrl}/authentication/sign-in`).flush(operatorSession);
    await signIn;

    expect(store.isSignedIn()).toBeTrue();
    expect(store.hasPermission('inventory.entry.create')).toBeTrue();
    expect(store.hasPermission('warehouses.create')).toBeFalse();
    expect(store.hasAnyPermission(['users.view', 'inventory.view'])).toBeTrue();
    expect(store.canAccessWarehouse(1)).toBeTrue();
    expect(store.canAccessWarehouse(2)).toBeFalse();
    expect(store.currentWarehouseId()).toBe(1);
    expect(store.landingPath()).toBe('/inventory');
    // Only the token and the username are persisted in the browser.
    expect(localStorage.getItem('node-secure.token')).toBe('jwt-token');
  });

  it('never trusts the browser: after a reload the context is loaded again from /authentication/me', () => {
    localStorage.setItem('node-secure.token', 'jwt-token');
    localStorage.setItem('node-secure.username', 'pepito');

    const store = createStore();
    expect(store.hasPermission('inventory.view')).toBeFalse();

    http.expectOne(`${environment.serverBaseUrl}/authentication/me`).flush({ ...operatorSession, token: null });

    expect(store.hasPermission('inventory.view')).toBeTrue();
    expect(store.currentUser()?.token).toBe('jwt-token');
  });

  it('closes the session when the API rejects the token (suspended or revoked)', () => {
    localStorage.setItem('node-secure.token', 'revoked-token');
    localStorage.setItem('node-secure.username', 'pepito');

    const store = createStore();
    http.expectOne(`${environment.serverBaseUrl}/authentication/me`)
      .flush({ title: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(store.isSignedIn()).toBeFalse();
    expect(localStorage.getItem('node-secure.token')).toBeNull();
  });

  it('sends the organization name on sign-up and lets the owner see every warehouse', async () => {
    const store = createStore();

    const signUp = store.signUp({
      fullName: 'Owner A', email: 'owner@a.pe', username: 'ownera', password: 'Secret-123',
      organizationName: 'Organización A'
    });
    const request = http.expectOne(`${environment.serverBaseUrl}/authentication/sign-up`);
    expect(request.request.body.organizationName).toBe('Organización A');
    expect(request.request.body.companyId).toBeUndefined();
    request.flush({
      ...operatorSession, role: 'ROLE_OWNER', allWarehouses: true, warehouseIds: [],
      permissions: ['warehouses.view', 'users.view']
    });
    await signUp;

    expect(store.isOwner()).toBeTrue();
    expect(store.canAccessWarehouse(99)).toBeTrue();
    expect(store.currentWarehouseId()).toBeNull();
    expect(store.landingPath()).toBe('/warehouses');
  });
});

import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideTranslateService } from '@ngx-translate/core';
import { Observable, firstValueFrom, of } from 'rxjs';

import { permissionGuard } from './permission.guard';
import { IamStore } from '../application/iam.store';

describe('permissionGuard', () => {
  const permissions = signal<string[]>([]);
  const iamStoreStub = {
    loadSession: () => of({ id: 1, username: 'pepito', token: 't' }),
    hasAnyPermission: (codes: readonly string[]) => codes.some((code) => permissions().includes(code))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideTranslateService({}),
        { provide: IamStore, useValue: iamStoreStub },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } }
      ]
    });
  });

  function run(required: string[]): Promise<boolean | UrlTree> {
    const route = { data: { permissions: required } } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(route, {} as RouterStateSnapshot)) as Observable<boolean | UrlTree>;
    return firstValueFrom(result);
  }

  it('lets the user in when it holds one of the required permissions', async () => {
    permissions.set(['inventory.entry.create']);
    expect(await run(['inventory.entry.create'])).toBeTrue();
  });

  it('redirects to access-denied when the permission is missing (direct URL)', async () => {
    permissions.set(['inventory.view']);
    const result = await run(['warehouses.create']);
    expect(result instanceof UrlTree).toBeTrue();
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/access-denied');
    expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalled();
  });
});

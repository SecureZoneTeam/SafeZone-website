import { Routes } from '@angular/router';
import { authenticationGuard } from './iam/infrastructure/authentication.guard';

/**
 * Root routing definitions.
 * Every bounded context exposes its own views through lazy-loaded standalone components.
 */
export const routes: Routes = [
  {
    path: 'sign-in',
    title: 'Sign In | NodeSecure',
    loadComponent: () =>
      import('./iam/presentation/pages/sign-in/sign-in').then((m) => m.SignIn)
  },
  {
    path: 'sign-up',
    title: 'Sign Up | NodeSecure',
    loadComponent: () =>
      import('./iam/presentation/pages/sign-up/sign-up').then((m) => m.SignUp)
  },
  {
    path: 'warehouses',
    title: 'My Warehouses | NodeSecure',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./warehouse-management/presentation/pages/warehouse-list/warehouse-list')
        .then((m) => m.WarehouseList)
  },
  {
    path: 'warehouses/new',
    title: 'Register Warehouse | NodeSecure',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./warehouse-management/presentation/pages/warehouse-form/warehouse-form')
        .then((m) => m.WarehouseForm)
  },
  {
    path: 'devices',
    title: 'IoT Devices | NodeSecure',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./sensor-integration/presentation/pages/sensor-node-list/sensor-node-list')
        .then((m) => m.SensorNodeList)
  },
  {
    path: 'alerts',
    title: 'Security Alerts | NodeSecure',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./security-alerts/presentation/pages/security-alert-list/security-alert-list')
        .then((m) => m.SecurityAlertList)
  },
  {
    path: 'traceability',
    title: 'Traceability Log | NodeSecure',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./reporting/presentation/pages/traceability-log/traceability-log')
        .then((m) => m.TraceabilityLog)
  },
  {
    path: 'subscription',
    title: 'Subscription | NodeSecure',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./subscription-management/presentation/pages/subscription-plan-list/subscription-plan-list')
        .then((m) => m.SubscriptionPlanList)
  },
  { path: '', redirectTo: 'warehouses', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/pages/page-not-found/page-not-found')
        .then((m) => m.PageNotFound)
  }
];

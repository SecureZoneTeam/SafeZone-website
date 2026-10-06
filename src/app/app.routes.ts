import { Routes } from '@angular/router';
import { authenticationGuard } from './iam/infrastructure/authentication.guard';

export const routes: Routes = [
  {
    path: 'sign-in',
    title: 'Sign In | NodeSecure',
    loadComponent: () =>
      import('./iam/presentation/pages/sign-in/sign-in')
        .then((m) => m.SignIn)
  },

  {
    path: 'sign-up',
    title: 'Sign Up | NodeSecure',
    loadComponent: () =>
      import('./iam/presentation/pages/sign-up/sign-up')
        .then((m) => m.SignUp)
  },
  {
    path: '',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./shared/presentation/components/layout/layout')
        .then((m) => m.Layout),

    children: [

      {
        path: '',
        redirectTo: 'warehouses',
        pathMatch: 'full'
      },

      {
        path: 'warehouses',
        title: 'My Warehouses | NodeSecure',
        loadComponent: () =>
          import('./warehouse-management/presentation/pages/warehouse-list/warehouse-list')
            .then((m) => m.WarehouseList)
      },

      {
        path: 'warehouses/new',
        title: 'Register Warehouse | NodeSecure',
        loadComponent: () =>
          import('./warehouse-management/presentation/pages/warehouse-form/warehouse-form')
            .then((m) => m.WarehouseForm)
      },

      {
        path: 'devices',
        title: 'IoT Devices | NodeSecure',
        loadComponent: () =>
          import('./sensor-integration/presentation/pages/sensor-node-list/sensor-node-list')
            .then((m) => m.SensorNodeList)
      },

      {
        path: 'devices/new',
        title: 'Link IoT Device | NodeSecure',
        loadComponent: () =>
          import('./sensor-integration/presentation/pages/sensor-node-form/sensor-node-form')
            .then((m) => m.SensorNodeForm)
      },

      {
        path: 'team',
        title: 'Team & Access | NodeSecure',
        loadComponent: () =>
          import('./iam/presentation/pages/user-access/user-access')
            .then((m) => m.UserAccess)
      },

      {
        path: 'traceability',
        title: 'Traceability Log | NodeSecure',
        loadComponent: () =>
          import('./reporting/presentation/pages/traceability-log/traceability-log')
            .then((m) => m.TraceabilityLog)
      },

      {
        path: 'subscription',
        title: 'Subscription | NodeSecure',
        loadComponent: () =>
          import('./subscription-management/presentation/pages/subscription-plan-list/subscription-plan-list')
            .then((m) => m.SubscriptionPlanList)
      },

      {
        path: 'subscription/checkout',
        title: 'Payment Summary | NodeSecure',
        canActivate: [authenticationGuard],
        loadComponent: () =>
          import('./subscription-management/presentation/pages/subscription-plan-checkout/subscription-checkout')
            .then((m) => m.SubscriptionCheckout)
      },

    ]
  },


  // ==========================================
  // 404
  // ==========================================

  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/pages/page-not-found/page-not-found')
        .then((m) => m.PageNotFound)
  }

];

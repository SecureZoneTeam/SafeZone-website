import { Routes } from '@angular/router';
import { authenticationGuard } from './iam/infrastructure/authentication.guard';

// Titles are translation keys (public/i18n -> "titles"), translated by TranslatedTitleStrategy.
export const routes: Routes = [
  {
    path: 'sign-in',
    title: 'titles.signIn',
    loadComponent: () =>
      import('./iam/presentation/pages/sign-in/sign-in')
        .then((m) => m.SignIn)
  },

  {
    path: 'sign-up',
    title: 'titles.signUp',
    loadComponent: () =>
      import('./iam/presentation/pages/sign-up/sign-up')
        .then((m) => m.SignUp)
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
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
        title: 'titles.warehouses',
        loadComponent: () =>
          import('./warehouse-management/presentation/pages/warehouse-list/warehouse-list')
            .then((m) => m.WarehouseList)
      },

      {
        path: 'warehouses/new',
        title: 'titles.warehouseNew',
        loadComponent: () =>
          import('./warehouse-management/presentation/pages/warehouse-form/warehouse-form')
            .then((m) => m.WarehouseForm)
      },

      {
        path: 'warehouses/:id',
        title: 'titles.warehouseView',
        loadComponent: () =>
          import('./warehouse-management/presentation/pages/warehouse-detail/warehouse-detail')
            .then((m) => m.WarehouseDetail)
      },

      {
        path: 'warehouses/:id/edit',
        title: 'titles.warehouseEdit',
        loadComponent: () =>
          import ('./warehouse-management/presentation/pages/warehouse-form/warehouse-form')
            .then((m) => m.WarehouseForm)
      },

      {
        path: 'devices',
        title: 'titles.devices',
        loadComponent: () =>
          import('./sensor-integration/presentation/pages/sensor-node-list/sensor-node-list')
            .then((m) => m.SensorNodeList)
      },

      {
        path: 'devices/new',
        title: 'titles.deviceNew',
        loadComponent: () =>
          import('./sensor-integration/presentation/pages/sensor-node-form/sensor-node-form')
            .then((m) => m.SensorNodeForm)
      },

      {
        path: 'devices/edit/:id',
        title: 'titles.deviceEdit',
        loadComponent: () =>
          import('./sensor-integration/presentation/pages/sensor-node-form/sensor-node-form')
            .then((m) => m.SensorNodeForm)
      },

      {
        path: 'team',
        title: 'titles.team',
        loadComponent: () =>
          import('./iam/presentation/pages/user-access/user-access')
            .then((m) => m.UserAccess)
      },

      {
        path: 'traceability',
        title: 'titles.traceability',
        loadComponent: () =>
          import('./reporting/presentation/pages/traceability-log/traceability-log')
            .then((m) => m.TraceabilityLog)
      },

      {
        path: 'traceability/:id',
        title: 'titles.eventDetail',
        loadComponent: () =>
          import('./reporting/presentation/pages/traceability-detail/traceability-detail')
            .then((m) => m.TraceabilityDetail)
      },

      {
        path: 'subscription',
        title: 'titles.subscription',
        loadComponent: () =>
          import('./subscription-management/presentation/pages/subscription-plan-list/subscription-plan-list')
            .then((m) => m.SubscriptionPlanList)
      },

      {
        path: 'subscription/checkout',
        title: 'titles.checkout',
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
    title: 'titles.notFound',
    loadComponent: () =>
      import('./shared/presentation/pages/page-not-found/page-not-found')
        .then((m) => m.PageNotFound)
  }

];

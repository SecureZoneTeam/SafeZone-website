import { Routes } from '@angular/router';
import { authenticationGuard } from './iam/infrastructure/authentication.guard';
import { landingGuard, permissionGuard } from './iam/infrastructure/permission.guard';
import { Permissions } from './iam/domain/model/permission';

/**
 * Titles are translation keys (public/i18n -> "titles"), translated by TranslatedTitleStrategy.
 * `data.permissions`: the user needs ANY of them (permissionGuard). The API enforces the same rules.
 */
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
    canActivateChild: [permissionGuard],
    loadComponent: () =>
      import('./shared/presentation/components/layout/layout')
        .then((m) => m.Layout),

    children: [

      {
        // Sends every user to the first screen its permissions allow (after the session is loaded).
        path: '',
        pathMatch: 'full',
        canActivate: [landingGuard],
        children: []
      },

      {
        path: 'access-denied',
        title: 'titles.accessDenied',
        loadComponent: () =>
          import('./shared/presentation/pages/access-denied/access-denied')
            .then((m) => m.AccessDenied)
      },

      {
        path: 'inventory',
        title: 'titles.inventory',
        data: { permissions: [Permissions.InventoryView] },
        loadComponent: () =>
          import('./inventory-management/presentation/pages/inventory-dashboard/inventory-dashboard')
            .then((m) => m.InventoryDashboard)
      },

      {
        path: 'inventory/products',
        title: 'titles.products',
        data: { permissions: [Permissions.ProductsView] },
        loadComponent: () =>
          import('./inventory-management/presentation/pages/product-list/product-list')
            .then((m) => m.ProductList)
      },

      {
        path: 'inventory/products/new',
        title: 'titles.productNew',
        data: { permissions: [Permissions.ProductsCreate] },
        loadComponent: () =>
          import('./inventory-management/presentation/pages/product-form/product-form')
            .then((m) => m.ProductForm)
      },

      {
        path: 'inventory/products/:id/edit',
        title: 'titles.productEdit',
        data: { permissions: [Permissions.ProductsUpdate] },
        loadComponent: () =>
          import('./inventory-management/presentation/pages/product-form/product-form')
            .then((m) => m.ProductForm)
      },

      {
        path: 'inventory/entries/new',
        title: 'titles.stockEntry',
        data: { permissions: [Permissions.EntryCreate] },
        loadComponent: () =>
          import('./inventory-management/presentation/pages/stock-entry-form/stock-entry-form')
            .then((m) => m.StockEntryForm)
      },

      {
        path: 'inventory/dispatch',
        title: 'titles.quickDispatch',
        data: { permissions: [Permissions.ExitCreate] },
        loadComponent: () =>
          import('./inventory-management/presentation/pages/quick-dispatch/quick-dispatch')
            .then((m) => m.QuickDispatch)
      },

      {
        path: 'warehouses',
        title: 'titles.warehouses',
        data: { permissions: [Permissions.WarehousesView] },
        loadComponent: () =>
          import('./warehouse-management/presentation/pages/warehouse-list/warehouse-list')
            .then((m) => m.WarehouseList)
      },

      {
        path: 'warehouses/new',
        title: 'titles.warehouseNew',
        data: { permissions: [Permissions.WarehousesCreate] },
        loadComponent: () =>
          import('./warehouse-management/presentation/pages/warehouse-form/warehouse-form')
            .then((m) => m.WarehouseForm)
      },

      {
        path: 'warehouses/:id',
        title: 'titles.warehouseView',
        data: { permissions: [Permissions.WarehousesView] },
        loadComponent: () =>
          import('./warehouse-management/presentation/pages/warehouse-detail/warehouse-detail')
            .then((m) => m.WarehouseDetail)
      },

      {
        path: 'warehouses/:id/edit',
        title: 'titles.warehouseEdit',
        data: { permissions: [Permissions.WarehousesUpdate] },
        loadComponent: () =>
          import ('./warehouse-management/presentation/pages/warehouse-form/warehouse-form')
            .then((m) => m.WarehouseForm)
      },

      {
        path: 'devices',
        title: 'titles.devices',
        data: { permissions: [Permissions.IotDevicesView] },
        loadComponent: () =>
          import('./sensor-integration/presentation/pages/sensor-node-list/sensor-node-list')
            .then((m) => m.SensorNodeList)
      },

      {
        path: 'devices/new',
        title: 'titles.deviceNew',
        data: { permissions: [Permissions.IotDevicesManage] },
        loadComponent: () =>
          import('./sensor-integration/presentation/pages/sensor-node-form/sensor-node-form')
            .then((m) => m.SensorNodeForm)
      },

      {
        path: 'devices/edit/:id',
        title: 'titles.deviceEdit',
        data: { permissions: [Permissions.IotDevicesManage] },
        loadComponent: () =>
          import('./sensor-integration/presentation/pages/sensor-node-form/sensor-node-form')
            .then((m) => m.SensorNodeForm)
      },

      {
        path: 'team',
        title: 'titles.team',
        data: { permissions: [Permissions.UsersView] },
        loadComponent: () =>
          import('./iam/presentation/pages/user-access/user-access')
            .then((m) => m.UserAccess)
      },

      {
        path: 'traceability',
        title: 'titles.traceability',
        data: { permissions: [Permissions.TraceabilityView] },
        loadComponent: () =>
          import('./reporting/presentation/pages/traceability-log/traceability-log')
            .then((m) => m.TraceabilityLog)
      },

      {
        path: 'traceability/:id',
        title: 'titles.eventDetail',
        data: { permissions: [Permissions.TraceabilityView] },
        loadComponent: () =>
          import('./reporting/presentation/pages/traceability-detail/traceability-detail')
            .then((m) => m.TraceabilityDetail)
      },

      {
        path: 'subscription',
        title: 'titles.subscription',
        data: { permissions: [Permissions.SubscriptionsView] },
        loadComponent: () =>
          import('./subscription-management/presentation/pages/subscription-plan-list/subscription-plan-list')
            .then((m) => m.SubscriptionPlanList)
      },

      {
        path: 'subscription/checkout',
        title: 'titles.checkout',
        data: { permissions: [Permissions.SubscriptionsManage] },
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

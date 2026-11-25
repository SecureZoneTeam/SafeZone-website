/**
 * Permission codes enforced by the NodeSecure API (GET /api/v1/permissions returns the catalog).
 * The frontend only uses them to adapt the interface: every operation is validated again by the backend.
 */
export const Permissions = {
  DashboardView: 'dashboard.view',
  WarehousesView: 'warehouses.view',
  WarehousesCreate: 'warehouses.create',
  WarehousesUpdate: 'warehouses.update',
  WarehousesDelete: 'warehouses.delete',
  InventoryView: 'inventory.view',
  ProductsView: 'inventory.products.view',
  ProductsCreate: 'inventory.products.create',
  ProductsUpdate: 'inventory.products.update',
  EntryView: 'inventory.entry.view',
  EntryCreate: 'inventory.entry.create',
  ExitView: 'inventory.exit.view',
  ExitCreate: 'inventory.exit.create',
  Reconcile: 'inventory.reconcile',
  TraceabilityView: 'traceability.view',
  IotDevicesView: 'iot.devices.view',
  IotDevicesManage: 'iot.devices.manage',
  AlertsView: 'alerts.view',
  AlertsManage: 'alerts.manage',
  ReportsView: 'reports.view',
  ReportsCreate: 'reports.create',
  UsersView: 'users.view',
  UsersCreate: 'users.create',
  UsersUpdate: 'users.update',
  UsersSuspend: 'users.suspend',
  SubscriptionsView: 'subscriptions.view',
  SubscriptionsManage: 'subscriptions.manage',
  SettingsView: 'settings.view',
  SettingsManage: 'settings.manage'
} as const;

export type PermissionCode = (typeof Permissions)[keyof typeof Permissions];

export const ALL_PERMISSIONS: PermissionCode[] = Object.values(Permissions);

/** Roles managed by the API. OWNER is only created by the public sign-up. */
export const Roles = {
  Owner: 'ROLE_OWNER',
  Supervisor: 'ROLE_SUPERVISOR',
  Operator: 'ROLE_OPERATOR'
} as const;

/** Roles the owner can assign to a worker. */
export const WORKER_ROLES = [Roles.Supervisor, Roles.Operator];

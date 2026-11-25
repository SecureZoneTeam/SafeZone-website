import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import {
  PermissionDefinition,
  TeamUser,
  UsersApiEndpoint
} from '../../../infrastructure/users-api.endpoint';
import { WarehousesApiEndpoint } from '../../../../warehouse-management/infrastructure/warehouses-api.endpoint';
import { Warehouse } from '../../../../warehouse-management/domain/model/warehouse.entity';
import { IamStore } from '../../../application/iam.store';
import { CanDirective } from '../../directives/can.directive';
import { Roles, WORKER_ROLES } from '../../../domain/model/permission';

/** Row of the permission matrix of a worker. */
interface PermissionRow {
  code: string;
  checked: boolean;
  isDefault: boolean;
}

/** Permission groups shown in the matrix, following the existing modules. */
const PERMISSION_GROUPS: ReadonlyArray<{ key: string; prefixes: string[] }> = [
  { key: 'general', prefixes: ['dashboard.', 'warehouses.'] },
  { key: 'inventory', prefixes: ['inventory.'] },
  { key: 'traceability', prefixes: ['traceability.', 'reports.'] },
  { key: 'devices', prefixes: ['iot.', 'alerts.'] }
];

const USERNAME_PATTERN = /^[a-z0-9._-]{3,30}$/;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Team & Access. The owner creates worker accounts directly (active immediately), assigns their role and
 * warehouse, customizes their permissions and suspends or reactivates them. Every action is validated by the
 * API, which also restricts the list to the owner's organization.
 */
@Component({
  selector: 'app-user-access',
  standalone: true,
  imports: [FormsModule, TranslatePipe, CanDirective],
  templateUrl: './user-access.html',
  styleUrl: './user-access.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAccess implements OnInit {
  private readonly usersApi = inject(UsersApiEndpoint);
  private readonly warehousesApi = inject(WarehousesApiEndpoint);
  protected readonly iamStore = inject(IamStore);

  protected readonly roles = WORKER_ROLES;
  protected readonly groups = PERMISSION_GROUPS;

  protected readonly users = signal<TeamUser[]>([]);
  protected readonly warehouses = signal<Warehouse[]>([]);
  protected readonly catalog = signal<PermissionDefinition[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  /** Translation keys or API messages. */
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly owners = computed(() => this.users().filter((user) => user.role === Roles.Owner));
  protected readonly workers = computed(() => this.users().filter((user) => user.role !== Roles.Owner));

  protected readonly showInviteModal = signal(false);
  protected readonly showEditModal = signal(false);
  protected readonly showDeleteModal = signal(false);
  protected readonly showPermissionsModal = signal(false);
  protected readonly selectedUser = signal<TeamUser | null>(null);

  // Create form (worker account)
  protected fullName = '';
  protected email = '';
  protected username = '';
  protected password = '';
  protected selectedRole: string = Roles.Operator;
  protected selectedWarehouseId = '';

  // Edit form
  protected editFullName = '';
  protected editRole: string = Roles.Operator;
  protected readonly editWarehouseIds = signal<Set<number>>(new Set());

  protected readonly permissionRows = signal<PermissionRow[]>([]);

  ngOnInit(): void {
    this.loadUsers();
    this.warehousesApi.getAll().subscribe({
      next: (warehouses) => this.warehouses.set(warehouses),
      error: () => this.errorMessage.set('team.messages.loadWarehousesError')
    });
    this.usersApi.getPermissionCatalog().subscribe({
      next: (catalog) => this.catalog.set(catalog.filter((permission) => !permission.ownerOnly)),
      error: () => this.catalog.set([])
    });
  }

  protected loadUsers(): void {
    this.loading.set(true);
    this.usersApi.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('team.messages.loadUsersError');
        this.loading.set(false);
      }
    });
  }

  // ------------------------------------------------------------------ helpers for the template

  protected roleKey(role: string): string {
    return `team.roles.${role}`;
  }

  protected permissionKey(code: string): string {
    return `team.permissionCodes.${code.replace(/\./g, '_')}`;
  }

  protected rowsOf(groupKey: string): PermissionRow[] {
    const group = PERMISSION_GROUPS.find((item) => item.key === groupKey);
    return this.permissionRows().filter((row) => group?.prefixes.some((prefix) => row.code.startsWith(prefix)));
  }

  protected warehouseNames(user: TeamUser): string {
    const names = (user.warehouseIds ?? [])
      .map((id) => this.warehouses().find((warehouse) => Number(warehouse.id) === Number(id))?.name)
      .filter((name): name is string => !!name);
    return names.join(', ');
  }

  protected isSelf(user: TeamUser): boolean {
    return Number(this.iamStore.currentUser()?.id) === Number(user.id);
  }

  protected getInitials(fullName: string): string {
    return fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  // ------------------------------------------------------------------ create worker

  protected openInvite(): void {
    this.fullName = '';
    this.email = '';
    this.username = '';
    this.password = '';
    this.selectedRole = Roles.Operator;
    this.selectedWarehouseId = '';
    this.clearMessages();
    this.showInviteModal.set(true);
  }

  protected closeInvite(): void {
    this.showInviteModal.set(false);
  }

  /** Suggests a username from the email while the field is still empty. */
  protected suggestUsername(): void {
    if (!this.username && this.email.includes('@')) {
      this.username = this.email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30);
    }
  }

  protected inviteUser(): void {
    this.clearMessages();
    const fullName = this.fullName.trim();
    const email = this.email.trim().toLowerCase();
    const username = this.username.trim().toLowerCase();

    if (!fullName || !email || !username || !this.password || !this.selectedWarehouseId) {
      this.errorMessage.set('team.messages.requiredFields');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      this.errorMessage.set('team.messages.invalidEmail');
      return;
    }
    if (!USERNAME_PATTERN.test(username)) {
      this.errorMessage.set('team.messages.invalidUsername');
      return;
    }
    if (this.password.length < 8 || this.password.length > 72) {
      this.errorMessage.set('team.messages.invalidPassword');
      return;
    }

    this.saving.set(true);
    this.usersApi.create({
      fullName,
      email,
      username,
      password: this.password,
      role: this.selectedRole,
      warehouseIds: [Number(this.selectedWarehouseId)]
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.password = '';
        this.closeInvite();
        this.successMessage.set('team.messages.userCreated');
        this.loadUsers();
      },
      error: (error: unknown) => this.fail(error, 'team.messages.createError')
    });
  }

  // ------------------------------------------------------------------ edit role / warehouses

  protected openEdit(user: TeamUser): void {
    this.clearMessages();
    this.selectedUser.set(user);
    this.editFullName = user.fullName;
    this.editRole = user.role;
    this.editWarehouseIds.set(new Set((user.warehouseIds ?? []).map(Number)));
    this.showEditModal.set(true);
  }

  protected closeEdit(): void {
    this.showEditModal.set(false);
    this.selectedUser.set(null);
  }

  protected toggleEditWarehouse(warehouseId: number | string): void {
    const id = Number(warehouseId);
    this.editWarehouseIds.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected saveEdit(): void {
    const user = this.selectedUser();
    if (!user) {
      return;
    }
    if (this.editWarehouseIds().size === 0 || !this.editFullName.trim()) {
      this.errorMessage.set('team.messages.requiredFields');
      return;
    }
    this.saving.set(true);
    this.usersApi.update(user.id, {
      fullName: this.editFullName.trim(),
      role: this.editRole,
      warehouseIds: [...this.editWarehouseIds()]
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeEdit();
        this.successMessage.set('team.messages.userUpdated');
        this.loadUsers();
      },
      error: (error: unknown) => this.fail(error, 'team.messages.updateError')
    });
  }

  // ------------------------------------------------------------------ permissions

  protected openPermissions(user: TeamUser): void {
    this.clearMessages();
    this.selectedUser.set(user);
    const granted = new Set(user.permissions ?? []);
    this.permissionRows.set(this.catalog().map((permission) => ({
      code: permission.code,
      checked: granted.has(permission.code),
      isDefault: permission.defaultRoles.includes(user.role)
    })));
    this.showPermissionsModal.set(true);
  }

  protected closePermissions(): void {
    this.showPermissionsModal.set(false);
    this.selectedUser.set(null);
  }

  protected togglePermission(code: string): void {
    this.permissionRows.update((rows) =>
      rows.map((row) => (row.code === code ? { ...row, checked: !row.checked } : row))
    );
  }

  /** Only the differences with the role defaults are stored as exceptions. */
  protected savePermissions(): void {
    const user = this.selectedUser();
    if (!user) {
      return;
    }
    const overrides: Record<string, boolean> = {};
    for (const row of this.permissionRows()) {
      if (row.checked !== row.isDefault) {
        overrides[row.code] = row.checked;
      }
    }
    this.saving.set(true);
    this.usersApi.updatePermissions(user.id, overrides).subscribe({
      next: () => {
        this.saving.set(false);
        this.closePermissions();
        this.successMessage.set('team.messages.permissionsSaved');
        this.loadUsers();
      },
      error: (error: unknown) => this.fail(error, 'team.messages.permissionsError')
    });
  }

  // ------------------------------------------------------------------ suspend / reactivate / delete

  protected toggleStatus(user: TeamUser): void {
    this.clearMessages();
    const request = user.status === 'SUSPENDED' ? this.usersApi.reactivate(user.id) : this.usersApi.suspend(user.id);
    request.subscribe({
      next: (updated) => {
        this.users.update((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        this.successMessage.set(updated.status === 'SUSPENDED' ? 'team.messages.userSuspended' : 'team.messages.userReactivated');
      },
      error: (error: unknown) => this.fail(error, 'team.messages.updateError')
    });
  }

  protected openDelete(user: TeamUser): void {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  protected closeDelete(): void {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  protected deleteUser(): void {
    const user = this.selectedUser();
    if (!user) {
      return;
    }
    this.usersApi.delete(user.id).subscribe({
      next: () => {
        this.users.update((current) => current.filter((item) => item.id !== user.id));
        this.successMessage.set('team.messages.userDeleted');
        this.closeDelete();
      },
      error: (error: unknown) => {
        this.fail(error, 'team.messages.deleteError');
        this.closeDelete();
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  /** Shows the API message (ProblemDetail.detail, already localized) or a generic key. */
  private fail(error: unknown, fallbackKey: string): void {
    this.saving.set(false);
    const detail = error instanceof HttpErrorResponse ? error.error?.detail : null;
    this.errorMessage.set(typeof detail === 'string' && detail ? detail : fallbackKey);
  }
}

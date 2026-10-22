
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {UsersApiEndpoint, TeamUser as ApiTeamUser} from "../../../infrastructure/users-api.endpoint";
import {WarehousesApiEndpoint} from "../../../../warehouse-management/infrastructure/warehouses-api.endpoint";
import {Warehouse} from "../../../../warehouse-management/domain/model/warehouse.entity";

interface TeamUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  companyId: number;
}

@Component({
  selector: 'app-user-access',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-access.html',
  styleUrl: './user-access.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAccess implements OnInit {
  private readonly usersApi = inject(UsersApiEndpoint);
  private readonly warehousesApi = inject(WarehousesApiEndpoint);

  protected readonly warehouses = signal<Warehouse[]>([]);
  protected selectedWarehouseId = '';

  protected readonly users = signal<TeamUser[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly administrators = computed(
    () => this.users().filter(user => user.status === 'ADMINISTRADOR')
  );

  protected readonly logisticsUsers = computed(
    () => this.users().filter(user => user.status !== 'ADMINISTRADOR')
  );

  protected readonly showInviteModal = signal(false);
  protected readonly showDeleteModal = signal(false);
  protected readonly showPermissionsModal = signal(false);
  protected readonly selectedUser = signal<TeamUser | null>(null);

  protected fullName = '';
  protected email = '';
  protected selectedRole = 'ROLE_WAREHOUSE_KEEPER';

  protected readonly permissions = signal([
    { id: 1, name: 'Zona A (Almacén Principal)', selected: true },
    { id: 2, name: 'Zona B (Recepción / Devoluciones)', selected: false },
    { id: 3, name: 'Zona C (Carga y Descarga)', selected: true }
  ]);

  ngOnInit(): void {
    this.loadUsers();
    this.warehousesApi.getAll().subscribe({
      next: warehouses => this.warehouses.set(warehouses),
      error: () => {
        this.errorMessage.set('No se pudieron cargar los almacenes.');
      }
    });
  }

  protected loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.usersApi.getAll().subscribe({
      next: (apiUsers: ApiTeamUser[]) => {
        const mappedUsers = apiUsers.map(user => {
          const role = user.roles[0] ?? 'ROLE_WAREHOUSE_KEEPER';

          return {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: this.getRoleLabel(role),
            status: this.getRoleStatus(role),
            companyId: user.companyId
          };
        });

        this.users.set(mappedUsers);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'No se pudieron cargar los usuarios. Comprueba que JSON Server esté ejecutándose.'
        );
        this.loading.set(false);
      }
    });
  }

  private getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      ROLE_ADMINISTRATOR: 'Administrador',
      ROLE_SECURITY_MANAGER: 'Security Manager',
      ROLE_WAREHOUSE_KEEPER: 'Warehouse Keeper',
      ROLE_AUDITOR: 'Auditor'
    };

    return labels[role] ?? role;
  }

  private getRoleStatus(role: string): string {
    return role === 'ROLE_ADMINISTRATOR'
      ? 'ADMINISTRADOR'
      : role;
  }

  protected openInvite(): void {
    this.fullName='';
    this.email='';
    this.selectedRole = 'ROLE_WAREHOUSE_KEEPER';
    this.selectedWarehouseId ='';

    this.errorMessage.set('');
    this.successMessage.set('');
    this.showInviteModal.set(true);
  }

  protected closeInvite(): void {
    this.showInviteModal.set(false);
  }

  protected inviteUser(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const fullName = this.fullName.trim();
    const email = this.email.trim().toLowerCase();
    const warehouseId = Number(this.selectedWarehouseId);

    if (!fullName || !email || !this.selectedWarehouseId) {
      this.errorMessage.set(
        'Completa el nombre, el correo y el almacén asignado.'
      );
      return;
    }

    const existingUser = this.users().some(
      user => user.email.toLowerCase() === email
    );

    if (existingUser) {
      this.errorMessage.set(
        'Ya existe un usuario registrado con ese correo.'
      );
      return;
    }

    const username = email.split('@')[0];
    const companyId = this.users()[0]?.companyId ?? 1;

    this.usersApi.create({
      username,
      email,
      fullName,
      roles: [this.selectedRole],
      companyId,
      warehouseId
    }).subscribe({
      next: () => {
        this.closeInvite();
        this.successMessage.set('Usuario creado correctamente.');
        this.loadUsers();
      },
      error: () => {
        this.errorMessage.set(
          'No se pudo crear el usuario. Comprueba que JSON Server esté ejecutándose.'
        );
      }
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
        this.users.update(current =>
          current.filter(item => item.id !== user.id)
        );
        this.successMessage.set('Usuario eliminado correctamente.');
        this.closeDelete();
      },
      error: () => {
        this.errorMessage.set('No se pudo eliminar el usuario.');
        this.closeDelete();
      }
    });
  }

  protected openPermissions(user: TeamUser): void {
    this.selectedUser.set(user);
    this.showPermissionsModal.set(true);
  }

  protected closePermissions(): void {
    this.showPermissionsModal.set(false);
    this.selectedUser.set(null);
  }

  protected togglePermission(index: number): void {
    this.permissions.update(items =>
      items.map((item, i) =>
        i === index
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  }

  protected savePermissions(): void {
    this.errorMessage.set(
      'Los permisos aún no se persisten porque falta definir su estructura en la API.'
    );
  }

  protected getInitials(fullName: string): string {
    return fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
}


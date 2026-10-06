import {
  ChangeDetectionStrategy,
  Component,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';


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

  imports: [
    FormsModule
  ],

  templateUrl: './user-access.html',

  styleUrl: './user-access.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAccess {

  protected readonly users = signal<TeamUser[]>([
    {
      id: 1,
      fullName: 'A. Usuario (Tú)',
      username: 'fperez',
      email: 'fernando.perez@safezone.pe',
      role: 'Administrador',
      status: 'ADMINISTRADOR',
      companyId: 1
    },
    {
      id: 2,
      fullName: 'Carlos Pérez',
      username: 'cperez',
      email: 'carlos.perez@safezone.pe',
      role: 'Almacenero',
      status: 'ALMACENERO',
      companyId: 1
    },
    {
      id: 3,
      fullName: 'Alex Alvarez',
      username: 'aalvarez',
      email: 'alex.alvarez@safezone.pe',
      role: 'Personal Logístico',
      status: 'LOGISTICO',
      companyId: 1
    }
  ]);


  protected readonly showInviteModal = signal(false);

  protected readonly showDeleteModal = signal(false);

  protected readonly showPermissionsModal = signal(false);


  protected readonly selectedUser = signal<TeamUser | null>(null);


  protected email = '';

  protected selectedRole = 'Administrador';


  protected readonly permissions = signal([
    {
      id: 1,
      name: 'Zona A (Almacén Principal)',
      selected: true
    },
    {
      id: 2,
      name: 'Zona B (Recepción / Devoluciones)',
      selected: false
    },
    {
      id: 3,
      name: 'Zona C (Carga y Descarga)',
      selected: true
    }
  ]);


  protected openInvite(): void {
    this.email = '';
    this.selectedRole = 'Administrador';

    this.showInviteModal.set(true);
  }


  protected closeInvite(): void {
    this.showInviteModal.set(false);
  }


  protected inviteUser(): void {

    if (!this.email.trim()) {
      return;
    }

    console.log('Invitation:', {
      email: this.email,
      role: this.selectedRole
    });

    this.showInviteModal.set(false);

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

    this.users.update(users =>
      users.filter(item => item.id !== user.id)
    );

    this.closeDelete();

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
          ? {
            ...item,
            selected: !item.selected
          }
          : item

      )

    );

  }


  protected savePermissions(): void {

    console.log(
      'Permissions:',
      this.permissions()
    );

    this.closePermissions();

  }

}

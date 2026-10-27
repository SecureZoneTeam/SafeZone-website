import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../../shared/infrastructure/language.service';
import { WarehouseStore } from '../../../application/warehouse.store';
import { Warehouse, WarehouseStatus } from '../../../domain/model/warehouse.entity';
import {UsersApiEndpoint, TeamUser} from "../../../../iam/infrastructure/users-api.endpoint";


@Component({
  selector: 'app-warehouse-detail',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './warehouse-detail.html',
  styleUrl: './warehouse-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly warehouseStore = inject(WarehouseStore);
  private readonly usersApi = inject(UsersApiEndpoint);
  private readonly language = inject(LanguageService);

  protected readonly assignedUsers = signal<TeamUser[]>([]);
  protected readonly usersLoading = signal(true);
  protected readonly usersError = signal('');
  protected readonly warehouse = signal<Warehouse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly WarehouseStatus = WarehouseStatus;
  protected readonly savingStatus = signal(false);
  protected readonly statusMessage = signal('');
  protected readonly statusError = signal('');


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.error.set('warehouses.messages.notSpecified');
      this.loading.set(false);
      return;
    }

    this.warehouseStore.getWarehouseById(id).subscribe({
      next: (warehouse) => {
        this.warehouse.set(warehouse);
        this.loading.set(false);

        this.usersLoading.set(true);
        this.usersError.set('');

        this.usersApi.getAll().subscribe({
          next: (users) => {
            this.assignedUsers.set(
              users.filter(
                user => String(user.warehouseId) === String(warehouse.id)
              )
            );
            this.usersLoading.set(false);
          },
          error: () => {
            this.usersError.set('warehouses.messages.loadUsersError');
            this.usersLoading.set(false);
          }
        });
      },
      error: (error: Error) => {
        this.error.set(error.message || 'warehouses.messages.loadError');
        this.loading.set(false);
      }
    });
  }
  protected toggleWarehouseStatus(): void {
    const currentWarehouse = this.warehouse();

    if (!currentWarehouse || this.savingStatus()) {
      return;
    }

    const nextStatus =
      currentWarehouse.status === WarehouseStatus.Active
        ? WarehouseStatus.Suspended
        : WarehouseStatus.Active;

    const confirmKey =
      nextStatus === WarehouseStatus.Suspended
        ? 'warehouses.detail.confirmDeactivate'
        : 'warehouses.detail.confirmActivate';

    const confirmed = window.confirm(
      this.language.instant(confirmKey, { name: currentWarehouse.name })
    );

    if (!confirmed) {
      return;
    }

    this.savingStatus.set(true);
    this.statusMessage.set('');
    this.statusError.set('');

    const updatedWarehouse = new Warehouse({
      ...currentWarehouse,
      status: nextStatus
    });

    this.warehouseStore
      .updateWarehouse(currentWarehouse.id, updatedWarehouse)
      .subscribe({
        next: warehouse => {
          this.warehouse.set(warehouse);
          this.statusMessage.set(
            nextStatus === WarehouseStatus.Active
              ? 'warehouses.detail.activated'
              : 'warehouses.detail.deactivated'
          );
          this.savingStatus.set(false);
        },
        error: () => {
          this.statusError.set('warehouses.detail.statusError');
          this.savingStatus.set(false);
        }
      });
  }
}

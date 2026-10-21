import {ChangeDetectionStrategy, Component, OnInit, inject, signal} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { WarehouseStore } from '../../../application/warehouse.store';
import {WarehouseZone} from "../../../domain/model/warehouse-zone.entity";
import {WarehouseZonesApiEndpoint} from "../../../infrastructure/warehouse-zones-api.endpoint";

/** Warehouse list view (user story US01). */
@Component({
  selector: 'app-warehouse-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TranslatePipe
  ],
  templateUrl: './warehouse-list.html',
  styleUrl: './warehouse-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseList implements OnInit {
  protected readonly warehouseStore = inject(WarehouseStore);
  protected readonly displayedColumns = ['name', 'district', 'zones', 'status', 'actions'];
  protected getZoneCount(warehouseId: number | string): number{
    return this.zones().filter(
      zone => String(zone.warehouseId) === String(warehouseId)
    ).length;
  }

  private readonly zonesApi = inject(WarehouseZonesApiEndpoint);
  private readonly zones = signal<WarehouseZone[]>([]);

  ngOnInit(): void {
    this.warehouseStore.loadWarehouses();

    this.zonesApi.getAll().subscribe({
      next: (zones) => this.zones.set(zones),
      error: (error) => {
        console.error('Error al cargar las zonas: ',error);
      }
    });
  }
}

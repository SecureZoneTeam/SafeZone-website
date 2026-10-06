import { Injectable, computed, inject, signal } from '@angular/core';

import { Warehouse } from '../domain/model/warehouse.entity';
import { WarehouseZone } from '../domain/model/warehouse-zone.entity';
import { WarehousesApiEndpoint } from '../infrastructure/warehouses-api.endpoint';
import { WarehouseZonesApiEndpoint } from '../infrastructure/warehouse-zones-api.endpoint';

/** Application state management for the Warehouse Management bounded context. */
@Injectable({ providedIn: 'root' })
export class WarehouseStore {
  private readonly warehousesApi = inject(WarehousesApiEndpoint);
  private readonly warehouseZonesApi = inject(WarehouseZonesApiEndpoint);

  private readonly warehousesSignal = signal<Warehouse[]>([]);
  private readonly zonesSignal = signal<WarehouseZone[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly warehouses = this.warehousesSignal.asReadonly();
  readonly zones = this.zonesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly warehouseCount = computed(() => this.warehousesSignal().length);
  readonly isEmpty = computed(() => !this.loadingSignal() && this.warehousesSignal().length === 0);

  loadWarehouses(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.warehousesApi.getAll().subscribe({
      next: (warehouses) => {
        this.warehousesSignal.set(warehouses);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        this.errorSignal.set(error.message);
        this.loadingSignal.set(false);
      }
    });
  }

  loadZones(): void {
    this.warehouseZonesApi.getAll().subscribe({
      next: (zones) => this.zonesSignal.set(zones),
      error: (error: Error) => this.errorSignal.set(error.message)
    });
  }

  createWarehouse(warehouse: Warehouse): void {
    this.warehousesApi.create(warehouse).subscribe({
      next: (created) => this.warehousesSignal.update((current) => [...current, created]),
      error: (error: Error) => this.errorSignal.set(error.message)
    });
  }

  deleteWarehouse(id: number | string): void {
    this.warehousesApi.delete(id).subscribe({
      next: () =>
        this.warehousesSignal.update((current) => current.filter((item) => item.id !== id)),
      error: (error: Error) => this.errorSignal.set(error.message)
    });
  }
}

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { SensorIntegrationStore } from '../../../application/sensor-integration.store';
import {RouterLink} from "@angular/router";
import {ConnectionStatus, SensorNode,SensorType} from "../../../domain/model/sensor-node.entity";

import { signal } from '@angular/core';
import { WarehouseZonesApiEndpoint } from '../../../../warehouse-management/infrastructure/warehouse-zones-api.endpoint';
import { WarehousesApiEndpoint } from '../../../../warehouse-management/infrastructure/warehouses-api.endpoint';
import { WarehouseZone } from '../../../../warehouse-management/domain/model/warehouse-zone.entity';
import { Warehouse } from '../../../../warehouse-management/domain/model/warehouse.entity';

/** IoT device list with connection status (user story US02). */
@Component({
  selector: 'app-sensor-node-list',
  imports: [MatTableModule, MatProgressBarModule, RouterLink],
  templateUrl: './sensor-node-list.html',
  styleUrl: './sensor-node-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorNodeList implements OnInit {
  protected readonly sensorIntegrationStore = inject(SensorIntegrationStore);
  protected readonly displayedColumns = ['macAddress', 'model', 'zone', 'connection', 'lastPing'];
  private readonly zonesApi = inject(WarehouseZonesApiEndpoint);
  private readonly warehousesApi = inject(WarehousesApiEndpoint);

  protected readonly zones = signal<WarehouseZone[]>([]);
  protected readonly warehouses = signal<Warehouse[]>([]);

  protected readonly SensorType = SensorType;

  protected readonly magneticSensors = () =>
    this.filteredSensorNodes().filter(
      node => node.sensorType === SensorType.MagneticContact
    );

  protected readonly rfidReaders = () =>
    this.filteredSensorNodes().filter(
      node => node.sensorType === SensorType.RFIDReader
    );

  protected readonly motionSensors = () =>
    this.filteredSensorNodes().filter(
      node => node.sensorType === SensorType.Motion
    );

  protected readonly selectedWarehouseId = signal('all');
  protected onWarehouseFilterChange(value: string): void{
    this.selectedWarehouseId.set(value);
  }

  protected filteredSensorNodes(): SensorNode[] {
    const selectedId = this.selectedWarehouseId();
    const nodes = this.sensorIntegrationStore.sensorNodes();

    if (selectedId === 'all') {
      return nodes;
    }

    const warehouseZones = this.zones().filter(
      zone => String(zone.warehouseId) === selectedId
    );

    const zoneIds = new Set(
      warehouseZones.map(zone => String(zone.id))
    );

    return nodes.filter(
      node => zoneIds.has(String(node.zoneId))
    );
  }

  ngOnInit(): void {
    this.sensorIntegrationStore.loadSensorNodes();

    this.zonesApi.getAll().subscribe({
      next: (zones) => this.zones.set(zones),
      error: (error) => console.error('Error al cargar zonas:', error)
    });

    this.warehousesApi.getAll().subscribe({
      next: (warehouses) => this.warehouses.set(warehouses),
      error: (error) => console.error('Error al cargar warehouses:', error)
    });
  }

  protected getWarehouseName(zoneId: number | string): string {
    const zone = this.zones().find(
      (item) => Number(item.id) === Number(zoneId)
    );
    if (!zone) {
      return 'Almacén no identificado';
    }
    const warehouse = this.warehouses().find(
      (item) => Number(item.id) === Number(zone.warehouseId)
    );
    return warehouse?.name ?? 'Almacén no identificado';
  }

  protected isWarehouseSuspended(zoneId: number | string): boolean {
    const zone = this.zones().find(
      item => String(item.id) === String(zoneId)
    );
    if (!zone) {
      return false;
    }
    const warehouse = this.warehouses().find(
      item => String(item.id) === String(zone.warehouseId)
    );
    return warehouse?.status === 'SUSPENDED';
  }

  protected canToggleSensor(node: SensorNode): boolean {
    return !this.isWarehouseSuspended(node.zoneId);
  }

  protected getZoneName(zoneId: number | string): string{
    const zone = this.zones().find(
      item => String(item.id) === String(zoneId)
    );
    return zone?.name ?? `Zona ${zoneId}`;
  }

  protected toggleSensorStatus(node: SensorNode): void {
    if (this.isWarehouseSuspended(node.zoneId)) {
      console.warn(
        'No se puede cambiar el estado del sensor porque su almacén está suspendido.'
      );
      return;
    }
    const updatedNode = new SensorNode({
      id: node.id,
      zoneId: node.zoneId,
      macAddress: node.macAddress,
      model: node.model,
      sensorType: node.sensorType,
      connectionStatus: node.isOnline
        ? ConnectionStatus.Offline
        : ConnectionStatus.Online,
      lastPingAt: node.lastPingAt
    });
    this.sensorIntegrationStore.updateSensorNode(updatedNode).subscribe({
      error: (error: Error) => {
        console.error(
          'No se pudo actualizar el estado del sensor:',
          error.message
        );
      }
    });
  }
}

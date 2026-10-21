
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { finalize, Observable } from 'rxjs';

import { SensorIntegrationStore } from '../../../application/sensor-integration.store';

import {
  ConnectionStatus,
  SensorNode,
  SensorType
} from '../../../domain/model/sensor-node.entity';

import { MacAddress } from '../../../domain/model/mac-address';

import { WarehouseZonesApiEndpoint } from '../../../../warehouse-management/infrastructure/warehouse-zones-api.endpoint';
import { WarehousesApiEndpoint } from '../../../../warehouse-management/infrastructure/warehouses-api.endpoint';

import { SensorNodesApiEndpoint } from '../../../infrastructure/sensor-nodes-api.endpoint';
import { WarehouseZone } from '../../../../warehouse-management/domain/model/warehouse-zone.entity';
import { Warehouse } from '../../../../warehouse-management/domain/model/warehouse.entity';

@Component({
  selector: 'app-sensor-node-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sensor-node-form.html',
  styleUrl: './sensor-node-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorNodeForm implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly sensorStore = inject(SensorIntegrationStore);
  private readonly zonesApi = inject(WarehouseZonesApiEndpoint);
  private readonly warehousesApi = inject(WarehousesApiEndpoint);
  private readonly router = inject(Router);

  private readonly sensorsApi = inject(SensorNodesApiEndpoint);

  private readonly route = inject(ActivatedRoute);
  protected readonly editing = signal(false);
  private sensorId: number | string | null = null;

  protected readonly warehouses = signal<Warehouse[]>([]);
  protected readonly zones = signal<WarehouseZone[]>([]);
  protected readonly filteredZones = signal<WarehouseZone[]>([]);

  protected loadingData = false;
  protected saving = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected readonly Number = Number;

  private originalSensor: SensorNode | null = null;
  protected onWarehouseChange(): void {
    const warehouseId = Number(this.form.controls.warehouseId.value);
    this.updateZonesForWarehouse(warehouseId);
  }

  protected readonly sensorTypes = [
    {
      value: SensorType.MagneticContact,
      label: 'Sensor magnético'
    },
    {
      value: SensorType.Motion,
      label: 'Sensor de movimiento'
    },
    {
      value: SensorType.Vibration,
      label: 'Sensor de vibración'
    },
    {
      value: SensorType.RFIDReader,
      label: 'Lector RFID'
    }
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    macAddress: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/)
      ]
    ],

    model: [
      'ESP32-WROOM-32',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    sensorType: [
      SensorType.MagneticContact,
      /*SensorType.Vibration,
      SensorType.RFIDReader,
      SensorType.Motion,*/
      Validators.required
    ],

    warehouseId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    zoneId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  ngOnInit(): void {
    this.loadingData = true;
    this.errorMessage = '';

    this.sensorId = this.route.snapshot.paramMap.get('id');
    this.editing.set(this.sensorId !== null);

    this.zonesApi.getAll().subscribe({
      next: (zones) => {
        this.zones.set(zones);

        this.warehousesApi.getAll().subscribe({
          next: (warehouses) => {
            this.warehouses.set(warehouses);

            if (this.sensorId !== null) {
              this.loadSensorForEdit();
            } else {
              this.loadingData = false;

              if (warehouses.length > 0) {
                const firstWarehouseId = Number(warehouses[0].id);

                this.form.controls.warehouseId.setValue(
                  firstWarehouseId
                );

                this.updateZonesForWarehouse(firstWarehouseId);
              }
            }
          },
          error: () => {
            this.loadingData = false;
            this.errorMessage = 'No se pudieron cargar los almacenes.';
          }
        });
      },
      error: () => {
        this.loadingData = false;
        this.errorMessage = 'No se pudieron cargar las zonas.';
      }
    });
  }

  private loadSensorForEdit(): void {
    this.sensorsApi.getById(this.sensorId!).subscribe({
      next: (node) => {
        this.originalSensor = node;
        const zone = this.zones().find(
          (item) => Number(item.id) === Number(node.zoneId)
        );
        if (!zone) {
          this.loadingData = false;
          this.errorMessage = 'No se encontró la zona del sensor.';
          return;
        }
        this.form.patchValue({
          macAddress: node.macAddress.value,
          model: node.model,
          sensorType: node.sensorType,
          warehouseId: Number(zone.warehouseId),
          zoneId: Number(zone.id)
        });
        this.filteredZones.set(
          this.zones().filter(
            (item) =>
              Number(item.warehouseId) === Number(zone.warehouseId)
          )
        );
        this.loadingData = false;
      },
      error: () => {
        this.loadingData = false;
        this.errorMessage = 'No se pudo cargar el sensor.';
      }
    });
  }

  private updateZonesForWarehouse(warehouseId: number): void {
    const availableZones = this.zones().filter(
      (zone) => Number(zone.warehouseId) === warehouseId
    );

    this.filteredZones.set(availableZones);

    // Reiniciar la zona anterior para evitar asociaciones incorrectas.
    this.form.controls.zoneId.setValue(
      availableZones.length > 0
        ? Number(availableZones[0].id)
        : 0
    );
  }

  protected submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.saving || this.loadingData) {
      return;
    }

    const value = this.form.getRawValue();

    const selectedWarehouse = this.warehouses().find(
      (warehouse) =>
        Number(warehouse.id) === Number(value.warehouseId)
    );

    const selectedZone = this.filteredZones().find(
      (zone) => Number(zone.id) === Number(value.zoneId)
    );

    if (!selectedWarehouse) {
      this.errorMessage = 'Selecciona un almacén válido.';
      return;
    }

    if (
      !selectedZone ||
      Number(selectedZone.warehouseId) !== Number(value.warehouseId)
    ) {
      this.errorMessage =
        'Selecciona una zona perteneciente al almacén elegido.';
      return;
    }

    const macAddress = new MacAddress(value.macAddress.trim());

    if (!macAddress.isValid) {
      this.form.controls.macAddress.setErrors({
        invalidMac: true
      });

      this.errorMessage =
        'La dirección MAC no tiene un formato válido.';
      return;
    }

    const node = new SensorNode({
      ...(this.originalSensor
        ? { id: this.originalSensor.id }
        : {}),
      zoneId: Number(selectedZone.id),
      macAddress,
      model: value.model.trim(),
      sensorType: value.sensorType as SensorType,
      connectionStatus:
        this.originalSensor?.connectionStatus ??
        ConnectionStatus.Offline,
      lastPingAt: this.originalSensor?.lastPingAt ?? null
    });

    this.saving = true;

    const saveOperation: Observable<SensorNode> =
      this.originalSensor
        ? this.sensorStore.updateSensorNode(node)
        : this.sensorStore.registerSensorNode(node);

    saveOperation
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: () => {
          this.successMessage = this.originalSensor
            ? 'Sensor actualizado correctamente.'
            : 'Sensor registrado correctamente.';

          void this.router.navigate(['/devices']);
        },
        error: (error: Error) => {
          this.errorMessage =
            error.message || 'No se pudo guardar el sensor.';
        }
      });
    /*por borrar, primero comprobar*/
    /*this.sensorStore.registerSensorNode(node)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: () => {
          this.successMessage =
            'Dispositivo IoT registrado correctamente.';

          void this.router.navigate(['/devices']);
        },

        error: (error: Error) => {
          this.errorMessage =
            error.message ||
            'No se pudo registrar el dispositivo.';
        }
      });*/
  }
}

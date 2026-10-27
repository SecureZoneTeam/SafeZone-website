
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SensorNode } from '../domain/model/sensor-node.entity';
import { SensorNodesApiEndpoint } from '../infrastructure/sensor-nodes-api.endpoint';


@Injectable({ providedIn: 'root' })
export class SensorIntegrationStore {
  private readonly sensorNodesApi = inject(SensorNodesApiEndpoint);

  private readonly sensorNodesSignal = signal<SensorNode[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly sensorNodes = this.sensorNodesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly onlineCount = computed(
    () => this.sensorNodesSignal().filter((node) => node.isOnline).length
  );

  readonly offlineCount = computed(
    () => this.sensorNodesSignal().filter((node) => !node.isOnline).length
  );

  loadSensorNodes(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.sensorNodesApi.getAll().subscribe({
      next: (nodes) => {
        this.sensorNodesSignal.set(nodes);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        this.errorSignal.set(error.message);
        this.loadingSignal.set(false);
      }
    });
  }

  registerSensorNode(node: SensorNode): Observable<SensorNode> {
    return this.sensorNodesApi.create(node).pipe(
      map((created) => {
        this.sensorNodesSignal.update((current) => [
          ...current,
          created
        ]);
        return created;
      })
    );
  }

  updateSensorNode(node: SensorNode): Observable<SensorNode> {
    return this.sensorNodesApi.update(node.id, node).pipe(
      map((updated) => {
        this.sensorNodesSignal.update((current) =>
          current.map((item) =>
            String(item.id) === String(updated.id)
              ? updated
              : item
          )
        );
        return updated;
      })
    );
  }

  linkSensorNode(node: SensorNode): void {
    this.registerSensorNode(node).subscribe({
      error: (error: Error) => {
        this.errorSignal.set(error.message);
      }
    });
  }
}

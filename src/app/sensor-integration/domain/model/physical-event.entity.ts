import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Type of physical event reported by an IoT sensor node (technical story TS09). */
export enum PhysicalEventType {
  DoorOpened = 'DOOR_OPENED',
  DoorClosed = 'DOOR_CLOSED',
  NodeDisconnected = 'NODE_DISCONNECTED'
}

/** Immutable record of what actually happened in the physical space. */
export class PhysicalEvent implements BaseEntity {
  id: number | string;
  sensorNodeId: number | string;
  zoneId: number | string;
  eventType: PhysicalEventType;
  occurredAt: Date;
  reconciled: boolean;

  constructor(event: {
    id?: number | string;
    sensorNodeId?: number | string;
    zoneId?: number | string;
    eventType?: PhysicalEventType;
    occurredAt?: Date;
    reconciled?: boolean;
  }) {
    this.id = event.id ?? 0;
    this.sensorNodeId = event.sensorNodeId ?? 0;
    this.zoneId = event.zoneId ?? 0;
    this.eventType = event.eventType ?? PhysicalEventType.DoorOpened;
    this.occurredAt = event.occurredAt ?? new Date();
    this.reconciled = event.reconciled ?? false;
  }
}

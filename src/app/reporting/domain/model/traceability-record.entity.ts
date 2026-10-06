import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Kind of entry stored in the immutable traceability log (user story US08). */
export enum TraceabilityRecordType {
  PhysicalAccess = 'PHYSICAL_ACCESS',
  InventoryMovement = 'INVENTORY_MOVEMENT',
  Discrepancy = 'DISCREPANCY',
  NodeDisconnection = 'NODE_DISCONNECTION'
}

/** TraceabilityRecord aggregate root of the Reporting bounded context. */
export class TraceabilityRecord implements BaseEntity {
  id: number | string;
  warehouseId: number | string;
  zoneId: number | string;
  recordType: TraceabilityRecordType;
  actor: string;
  description: string;
  occurredAt: Date;

  constructor(record: {
    id?: number | string;
    warehouseId?: number | string;
    zoneId?: number | string;
    recordType?: TraceabilityRecordType;
    actor?: string;
    description?: string;
    occurredAt?: Date;
  }) {
    this.id = record.id ?? 0;
    this.warehouseId = record.warehouseId ?? 0;
    this.zoneId = record.zoneId ?? 0;
    this.recordType = record.recordType ?? TraceabilityRecordType.PhysicalAccess;
    this.actor = record.actor ?? 'SYSTEM';
    this.description = record.description ?? '';
    this.occurredAt = record.occurredAt ?? new Date();
  }
}

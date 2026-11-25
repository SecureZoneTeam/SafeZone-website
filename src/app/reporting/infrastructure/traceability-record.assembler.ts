import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import {
  TraceabilityRecord,
  TraceabilityRecordType
} from '../domain/model/traceability-record.entity';
import { TraceabilityRecordResponse } from './traceability-record.response';

/** Maps backend stock-movement types to traceability record types. */
function toRecordType(movementType: string): TraceabilityRecordType {
  return (movementType ?? '').toUpperCase() === 'RECONCILIATION'
    ? TraceabilityRecordType.Discrepancy
    : TraceabilityRecordType.InventoryMovement;
}

/** Translates stock-movement resources into TraceabilityRecord entities (read-only log). */
export class TraceabilityRecordAssembler
  implements BaseAssembler<TraceabilityRecord, TraceabilityRecordResponse>
{
  toEntityFromResource(resource: TraceabilityRecordResponse): TraceabilityRecord {
    const movementType = (resource.type ?? '').toUpperCase();
    const quantity = resource.quantity != null ? ` x${resource.quantity}` : '';
    const summary = `${movementType} · #${resource.productId}${quantity}`;
    return new TraceabilityRecord({
      id: resource.id,
      warehouseId: resource.warehouseId,
      zoneId: '-', // stock movements are not tied to a zone
      recordType: toRecordType(movementType),
      actor: resource.performedBy || 'SYSTEM',
      description: resource.justification ? `${summary} — ${resource.justification}` : summary,
      occurredAt: new Date(resource.occurredAt)
    });
  }

  toEntitiesFromResponse(response: TraceabilityRecordResponse[]): TraceabilityRecord[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  /** The traceability log is read-only; kept only to satisfy BaseAssembler. */
  toResourceFromEntity(entity: TraceabilityRecord): TraceabilityRecordResponse {
    return {
      id: entity.id,
      productId: 0,
      warehouseId: Number(entity.warehouseId),
      type: entity.recordType === TraceabilityRecordType.Discrepancy ? 'RECONCILIATION' : 'ENTRY',
      performedBy: entity.actor,
      occurredAt: entity.occurredAt.toISOString(),
      justification: entity.description
    };
  }
}

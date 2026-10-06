import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import {
  TraceabilityRecord,
  TraceabilityRecordType
} from '../domain/model/traceability-record.entity';
import { TraceabilityRecordResponse } from './traceability-record.response';

/** Translates TraceabilityRecord resources into TraceabilityRecord entities. */
export class TraceabilityRecordAssembler
  implements BaseAssembler<TraceabilityRecord, TraceabilityRecordResponse>
{
  toEntityFromResource(resource: TraceabilityRecordResponse): TraceabilityRecord {
    return new TraceabilityRecord({
      id: resource.id,
      warehouseId: resource.warehouseId,
      zoneId: resource.zoneId,
      recordType: resource.recordType as TraceabilityRecordType,
      actor: resource.actor,
      description: resource.description,
      occurredAt: new Date(resource.occurredAt)
    });
  }

  toEntitiesFromResponse(response: TraceabilityRecordResponse[]): TraceabilityRecord[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: TraceabilityRecord): TraceabilityRecordResponse {
    return {
      id: entity.id,
      warehouseId: entity.warehouseId,
      zoneId: entity.zoneId,
      recordType: entity.recordType,
      actor: entity.actor,
      description: entity.description,
      occurredAt: entity.occurredAt.toISOString()
    };
  }
}

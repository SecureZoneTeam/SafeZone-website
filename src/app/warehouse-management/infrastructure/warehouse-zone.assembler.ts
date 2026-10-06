import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { WarehouseZone, ZoneRiskLevel } from '../domain/model/warehouse-zone.entity';
import { WarehouseZoneResponse } from './warehouse.response';

/** Translates WarehouseZone resources into WarehouseZone entities. */
export class WarehouseZoneAssembler implements BaseAssembler<WarehouseZone, WarehouseZoneResponse> {
  toEntityFromResource(resource: WarehouseZoneResponse): WarehouseZone {
    return new WarehouseZone({
      id: resource.id,
      warehouseId: resource.warehouseId,
      name: resource.name,
      code: resource.code,
      riskLevel: resource.riskLevel as ZoneRiskLevel,
      openingShiftStart: resource.openingShiftStart,
      openingShiftEnd: resource.openingShiftEnd
    });
  }

  toEntitiesFromResponse(response: WarehouseZoneResponse[]): WarehouseZone[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: WarehouseZone): WarehouseZoneResponse {
    return {
      id: entity.id,
      warehouseId: entity.warehouseId,
      name: entity.name,
      code: entity.code,
      riskLevel: entity.riskLevel,
      openingShiftStart: entity.openingShiftStart,
      openingShiftEnd: entity.openingShiftEnd
    };
  }
}

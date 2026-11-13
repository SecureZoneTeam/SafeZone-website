import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { StockMovement, StockMovementType } from '../domain/model/stock-movement.entity';
import { StockMovementResponse } from './stock-movement.response';

/** Translates immutable stock movement resources into domain entities. */
export class StockMovementAssembler
  implements BaseAssembler<StockMovement, StockMovementResponse>
{
  toEntityFromResource(resource: StockMovementResponse): StockMovement {
    return new StockMovement({
      id: resource.id,
      productId: resource.productId,
      warehouseId: resource.warehouseId,
      type: resource.type as StockMovementType,
      quantity: resource.quantity,
      previousStock: resource.previousStock,
      resultingStock: resource.resultingStock,
      performedBy: resource.performedBy,
      occurredAt: new Date(resource.occurredAt),
      justification: resource.justification
    });
  }

  toEntitiesFromResponse(response: StockMovementResponse[]): StockMovement[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: StockMovement): StockMovementResponse {
    return {
      id: entity.id,
      productId: entity.productId,
      warehouseId: entity.warehouseId,
      type: entity.type,
      quantity: entity.quantity,
      previousStock: entity.previousStock,
      resultingStock: entity.resultingStock,
      performedBy: entity.performedBy,
      occurredAt: entity.occurredAt.toISOString(),
      justification: entity.justification
    };
  }
}

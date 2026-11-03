import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Kind of immutable inventory stock movement. */
export enum StockMovementType {
  Entry = 'ENTRY',
  Exit = 'EXIT',
  Reconciliation = 'RECONCILIATION'
}

/** Immutable record of a stock change in a warehouse. */
export class StockMovement implements BaseEntity {
  readonly id: number | string;
  readonly productId: number | string;
  readonly warehouseId: number | string;
  readonly type: StockMovementType;
  readonly quantity: number;
  readonly previousStock: number;
  readonly resultingStock: number;
  readonly performedBy: string;
  readonly occurredAt: Date;
  readonly justification: string | null;

  constructor(movement: {
    id?: number | string;
    productId: number | string;
    warehouseId: number | string;
    type: StockMovementType;
    quantity: number;
    previousStock: number;
    resultingStock: number;
    performedBy: string;
    occurredAt?: Date;
    justification?: string | null;
  }) {
    this.id = movement.id ?? 0;
    this.productId = movement.productId;
    this.warehouseId = movement.warehouseId;
    this.type = movement.type;
    this.quantity = movement.quantity;
    this.previousStock = movement.previousStock;
    this.resultingStock = movement.resultingStock;
    this.performedBy = movement.performedBy;
    this.occurredAt = movement.occurredAt ?? new Date();
    this.justification = movement.justification ?? null;
  }
}

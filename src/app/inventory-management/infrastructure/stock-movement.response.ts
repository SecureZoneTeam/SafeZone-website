import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Immutable stock movement resource exposed by the inventory API. */
export interface StockMovementResponse extends BaseResponse {
  productId: number | string;
  warehouseId: number | string;
  type: string;
  quantity: number;
  previousStock: number;
  resultingStock: number;
  performedBy: string;
  occurredAt: string;
  justification: string | null;
}

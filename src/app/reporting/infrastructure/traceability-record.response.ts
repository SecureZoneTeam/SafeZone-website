import { BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource exposed by the NodeSecure RESTful API that backs the traceability log:
 * the StockMovementResource returned by GET /api/v1/stock-movements.
 */
export interface TraceabilityRecordResponse extends BaseResponse {
  productId: number;
  warehouseId: number;
  /** ENTRY | EXIT | RECONCILIATION */
  type: string;
  quantity?: number;
  performedBy: string | null;
  occurredAt: string;
  justification: string | null;
}

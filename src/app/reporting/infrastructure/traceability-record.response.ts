import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Resource exposed by the NodeSecure RESTful API for the TraceabilityRecord aggregate. */
export interface TraceabilityRecordResponse extends BaseResponse {
  warehouseId: number | string;
  zoneId: number | string;
  recordType: string;
  actor: string;
  description: string;
  occurredAt: string;
}

import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Resource exposed by the NodeSecure RESTful API for the SecurityAlert aggregate. */
export interface SecurityAlertResponse extends BaseResponse {
  warehouseId: number | string;
  zoneId: number | string;
  physicalEventId: number | string;
  alertType: string;
  severity: string;
  status: string;
  message: string;
  raisedAt: string;
  justification: string | null;
}

import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Resource exposed by the NodeSecure RESTful API for the SensorNode aggregate. */
export interface SensorNodeResponse extends BaseResponse {
  zoneId: number | string;
  macAddress: string;
  model: string;
  sensorType: string;
  connectionStatus: string;
  lastPingAt: string | null;
}

/** Resource exposed for the PhysicalEvent entity. */
export interface PhysicalEventResponse extends BaseResponse {
  sensorNodeId: number | string;
  zoneId: number | string;
  eventType: string;
  occurredAt: string;
  reconciled: boolean;
}

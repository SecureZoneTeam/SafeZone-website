import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Resource exposed by the NodeSecure RESTful API for the Warehouse aggregate. */
export interface WarehouseResponse extends BaseResponse {
  companyId: number | string;
  name: string;
  street: string;
  district: string;
  city: string;
  country: string;
  status: string;
  zoneCount: number;
}

/** Resource exposed for the WarehouseZone entity. */
export interface WarehouseZoneResponse extends BaseResponse {
  warehouseId: number | string;
  name: string;
  code: string;
  riskLevel: string;
  openingShiftStart: string;
  openingShiftEnd: string;
}

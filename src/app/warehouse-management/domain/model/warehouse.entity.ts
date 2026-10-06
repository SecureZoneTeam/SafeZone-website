import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { StreetAddress } from './street-address';

/** Operational status of a warehouse. */
export enum WarehouseStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED'
}

/** Warehouse aggregate root (user stories US01 and US04). */
export class Warehouse implements BaseEntity {
  id: number | string;
  companyId: number | string;
  name: string;
  address: StreetAddress;
  status: WarehouseStatus;
  zoneCount: number;

  constructor(warehouse: {
    id?: number | string;
    companyId?: number | string;
    name?: string;
    address?: StreetAddress;
    status?: WarehouseStatus;
    zoneCount?: number;
  }) {
    this.id = warehouse.id ?? 0;
    this.companyId = warehouse.companyId ?? 0;
    this.name = warehouse.name ?? '';
    this.address = warehouse.address ?? new StreetAddress();
    this.status = warehouse.status ?? WarehouseStatus.Active;
    this.zoneCount = warehouse.zoneCount ?? 0;
  }
}

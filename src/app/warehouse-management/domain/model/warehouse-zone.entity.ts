import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Risk level assigned to a zone, used by the discrepancy engine. */
export enum ZoneRiskLevel {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Critical = 'CRITICAL'
}

/** Warehouse zone entity, owned by the Warehouse aggregate (user story US05). */
export class WarehouseZone implements BaseEntity {
  id: number | string;
  warehouseId: number | string;
  name: string;
  code: string;
  riskLevel: ZoneRiskLevel;
  openingShiftStart: string;
  openingShiftEnd: string;

  constructor(zone: {
    id?: number | string;
    warehouseId?: number | string;
    name?: string;
    code?: string;
    riskLevel?: ZoneRiskLevel;
    openingShiftStart?: string;
    openingShiftEnd?: string;
  }) {
    this.id = zone.id ?? 0;
    this.warehouseId = zone.warehouseId ?? 0;
    this.name = zone.name ?? '';
    this.code = zone.code ?? '';
    this.riskLevel = zone.riskLevel ?? ZoneRiskLevel.Low;
    this.openingShiftStart = zone.openingShiftStart ?? '08:00';
    this.openingShiftEnd = zone.openingShiftEnd ?? '18:00';
  }
}

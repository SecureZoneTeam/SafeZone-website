import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Category of the alert raised by the discrepancy engine (user story US03). */
export enum AlertType {
  Discrepancy = 'DISCREPANCY',
  UnauthorizedAccess = 'UNAUTHORIZED_ACCESS',
  NodeDisconnection = 'NODE_DISCONNECTION'
}

/** Severity scale applied to alerts. */
export enum AlertSeverity {
  Minor = 'MINOR',
  Major = 'MAJOR',
  Critical = 'CRITICAL'
}

/** Lifecycle status of an alert (user story US07). */
export enum AlertStatus {
  Open = 'OPEN',
  Reconciled = 'RECONCILED',
  FalseAlarm = 'FALSE_ALARM'
}

/** SecurityAlert aggregate root of the Security Alerts bounded context. */
export class SecurityAlert implements BaseEntity {
  id: number | string;
  warehouseId: number | string;
  zoneId: number | string;
  physicalEventId: number | string;
  alertType: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  raisedAt: Date;
  justification: string | null;

  constructor(alert: {
    id?: number | string;
    warehouseId?: number | string;
    zoneId?: number | string;
    physicalEventId?: number | string;
    alertType?: AlertType;
    severity?: AlertSeverity;
    status?: AlertStatus;
    message?: string;
    raisedAt?: Date;
    justification?: string | null;
  }) {
    this.id = alert.id ?? 0;
    this.warehouseId = alert.warehouseId ?? 0;
    this.zoneId = alert.zoneId ?? 0;
    this.physicalEventId = alert.physicalEventId ?? 0;
    this.alertType = alert.alertType ?? AlertType.Discrepancy;
    this.severity = alert.severity ?? AlertSeverity.Minor;
    this.status = alert.status ?? AlertStatus.Open;
    this.message = alert.message ?? '';
    this.raisedAt = alert.raisedAt ?? new Date();
    this.justification = alert.justification ?? null;
  }

  get isOpen(): boolean {
    return this.status === AlertStatus.Open;
  }
}

import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { MacAddress } from './mac-address';

/** Connection status reported by a sensor node (user story US02). */
export enum ConnectionStatus {
  Online = 'ONLINE',
  Offline = 'OFFLINE'
}

/** Kind of physical sensor attached to the node. */
export enum SensorType {
  MagneticContact = 'MAGNETIC_CONTACT',
  Motion = 'MOTION',
  Vibration = 'VIBRATION'
}

/** SensorNode aggregate root of the Sensor Integration bounded context (user story US19). */
export class SensorNode implements BaseEntity {
  id: number | string;
  zoneId: number | string;
  macAddress: MacAddress;
  model: string;
  sensorType: SensorType;
  connectionStatus: ConnectionStatus;
  lastPingAt: Date | null;

  constructor(node: {
    id?: number | string;
    zoneId?: number | string;
    macAddress?: MacAddress;
    model?: string;
    sensorType?: SensorType;
    connectionStatus?: ConnectionStatus;
    lastPingAt?: Date | null;
  }) {
    this.id = node.id ?? 0;
    this.zoneId = node.zoneId ?? 0;
    this.macAddress = node.macAddress ?? new MacAddress('');
    this.model = node.model ?? 'ESP32-WROOM-32';
    this.sensorType = node.sensorType ?? SensorType.MagneticContact;
    this.connectionStatus = node.connectionStatus ?? ConnectionStatus.Offline;
    this.lastPingAt = node.lastPingAt ?? null;
  }

  get isOnline(): boolean {
    return this.connectionStatus === ConnectionStatus.Online;
  }
}

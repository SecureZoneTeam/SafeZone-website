import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { MacAddress } from '../domain/model/mac-address';
import {
  ConnectionStatus,
  SensorNode,
  SensorType
} from '../domain/model/sensor-node.entity';
import { SensorNodeResponse } from './sensor-node.response';

/** Translates SensorNode resources into SensorNode entities. */
export class SensorNodeAssembler implements BaseAssembler<SensorNode, SensorNodeResponse> {
  toEntityFromResource(resource: SensorNodeResponse): SensorNode {
    return new SensorNode({
      id: resource.id,
      zoneId: resource.zoneId,
      macAddress: new MacAddress(resource.macAddress),
      model: resource.model,
      sensorType: resource.sensorType as SensorType,
      connectionStatus: resource.connectionStatus as ConnectionStatus,
      lastPingAt: resource.lastPingAt ? new Date(resource.lastPingAt) : null
    });
  }

  toEntitiesFromResponse(response: SensorNodeResponse[]): SensorNode[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: SensorNode): SensorNodeResponse {
    return {
      id: entity.id,
      zoneId: entity.zoneId,
      macAddress: entity.macAddress.value,
      model: entity.model,
      sensorType: entity.sensorType,
      connectionStatus: entity.connectionStatus,
      lastPingAt: entity.lastPingAt ? entity.lastPingAt.toISOString() : null
    };
  }
}

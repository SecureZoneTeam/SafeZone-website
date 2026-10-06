import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { SensorNode } from '../domain/model/sensor-node.entity';
import { SensorNodeResponse } from './sensor-node.response';
import { SensorNodeAssembler } from './sensor-node.assembler';
import { environment } from '../../../environments/environment';

const sensorNodesResourceEndpointPath = '/sensor-nodes';

/** API endpoint for the SensorNode aggregate. */
@Injectable({ providedIn: 'root' })
export class SensorNodesApiEndpoint extends BaseApiEndpoint<
  SensorNode,
  SensorNodeResponse,
  SensorNodeAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${sensorNodesResourceEndpointPath}`,
      new SensorNodeAssembler()
    );
  }
}

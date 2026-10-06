import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { WarehouseZone } from '../domain/model/warehouse-zone.entity';
import { WarehouseZoneResponse } from './warehouse.response';
import { WarehouseZoneAssembler } from './warehouse-zone.assembler';
import { environment } from '../../../environments/environment';

const warehouseZonesResourceEndpointPath = '/warehouse-zones';

/** API endpoint for the WarehouseZone entity. */
@Injectable({ providedIn: 'root' })
export class WarehouseZonesApiEndpoint extends BaseApiEndpoint<
  WarehouseZone,
  WarehouseZoneResponse,
  WarehouseZoneAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${warehouseZonesResourceEndpointPath}`,
      new WarehouseZoneAssembler()
    );
  }
}

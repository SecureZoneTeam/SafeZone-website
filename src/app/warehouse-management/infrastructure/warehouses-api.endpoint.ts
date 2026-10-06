import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { Warehouse } from '../domain/model/warehouse.entity';
import { WarehouseResponse } from './warehouse.response';
import { WarehouseAssembler } from './warehouse.assembler';
import { environment } from '../../../environments/environment';

const warehousesResourceEndpointPath = '/warehouses';

/** API endpoint for the Warehouse aggregate. */
@Injectable({ providedIn: 'root' })
export class WarehousesApiEndpoint extends BaseApiEndpoint<
  Warehouse,
  WarehouseResponse,
  WarehouseAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${warehousesResourceEndpointPath}`,
      new WarehouseAssembler()
    );
  }
}

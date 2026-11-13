import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { environment } from '../../../environments/environment';
import { StockMovement } from '../domain/model/stock-movement.entity';
import { StockMovementAssembler } from './stock-movement.assembler';
import { StockMovementResponse } from './stock-movement.response';

const stockMovementsResourceEndpointPath = '/stock-movements';

/** API endpoint for immutable stock movement reads. */
@Injectable({ providedIn: 'root' })
export class StockMovementsApiEndpoint extends BaseApiEndpoint<
  StockMovement,
  StockMovementResponse,
  StockMovementAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${stockMovementsResourceEndpointPath}`,
      new StockMovementAssembler()
    );
  }
}
